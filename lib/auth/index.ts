import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db/pool'

const ACCESS_COOKIE = 'nc_access'
const REFRESH_COOKIE = 'nc_refresh'
const CSRF_COOKIE = 'nc_csrf'

const ACCESS_TTL = 60 * 15 // 15 minutes
const REFRESH_TTL = 60 * 60 * 24 * 7 // 7 days

export interface AuthUser {
  uid: string
  email: string
  name: string
  role: 'super_admin' | 'content_admin' | 'exam_admin' | 'user'
}

export interface SessionUser {
  uid: string
  email: string
  name: string
  role: string
}

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_JWT_SECRET
  if (!raw || raw.length < 32) {
    throw new Error('AUTH_JWT_SECRET must be set to a >=32-char random string')
  }
  return new TextEncoder().encode(raw)
}

function getRefreshSecret(): Uint8Array {
  const raw = process.env.AUTH_REFRESH_SECRET
  if (!raw || raw.length < 32) {
    throw new Error('AUTH_REFRESH_SECRET must be set to a >=32-char random string')
  }
  return new TextEncoder().encode(raw)
}

/* ---------------- password hashing ---------------- */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Support legacy sha256 hashes recorded before bcrypt migration.
  if (stored.length === 64 && /^[0-9a-f]{64}$/.test(stored)) {
    const { createHash } = await import('crypto')
    const legacy = createHash('sha256').update(password).digest('hex')
    if (legacy === stored) return true
    return false
  }
  return bcrypt.compare(password, stored)
}

/* ---------------- JWT ---------------- */

export async function signAccessToken(user: AuthUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({
    sub: user.uid,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + ACCESS_TTL)
    .setIssuer('national-college')
    .setAudience('national-college-cms')
    .sign(getSecret())
}

async function verifyAccessToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: 'national-college',
      audience: 'national-college-cms',
    })
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') return null
    return {
      uid: payload.sub,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : '',
      role: (payload.role as AuthUser['role']) ?? 'user',
    }
  } catch {
    return null
  }
}

/* ---------------- refresh tokens (DB-backed, hashed) ---------------- */

async function sha256(input: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(input).digest('hex')
}

function randomToken(): string {
  // 32 bytes of entropy, base64url
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Buffer.from(bytes).toString('base64url')
}

export async function issueRefreshToken(
  user: AuthUser,
  meta: { userAgent?: string; ip?: string } = {}
): Promise<string> {
  const token = randomToken()
  const tokenHash = await sha256(token)
  await pool.query(
    `INSERT INTO auth_sessions (user_id, token_hash, user_agent, ip, expires_at)
     VALUES ($1, $2, $3, $4::inet, now() + interval '${REFRESH_TTL} seconds')`,
    [user.uid, tokenHash, meta.userAgent ?? null, meta.ip ?? null]
  )
  return token
}

export async function revokeRefreshToken(token: string): Promise<void> {
  if (!token) return
  const tokenHash = await sha256(token)
  await pool.query(
    `UPDATE auth_sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  )
}

export async function rotateRefreshToken(
  oldToken: string,
  user: AuthUser,
  meta: { userAgent?: string; ip?: string } = {}
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const tokenHash = await sha256(oldToken)
  const res = await pool.query(
    `UPDATE auth_sessions
     SET revoked_at = now()
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()
     RETURNING user_id`,
    [tokenHash]
  )
  if (res.rowCount === 0) return null
  if (res.rows[0].user_id !== user.uid) return null
  const accessToken = await signAccessToken(user)
  const refreshToken = await issueRefreshToken(user, meta)
  return { accessToken, refreshToken }
}

/* ---------------- cookies ---------------- */

function isSecure() {
  return process.env.NODE_ENV === 'production'
}

function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    secure: isSecure(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function setSessionCookies(
  user: AuthUser,
  meta: { userAgent?: string; ip?: string } = {}
): Promise<void> {
  const accessToken = await signAccessToken(user)
  const refreshToken = await issueRefreshToken(user, meta)
  const store = cookies()
  store.set(ACCESS_COOKIE, accessToken, cookieOpts(ACCESS_TTL))
  store.set(REFRESH_COOKIE, refreshToken, cookieOpts(REFRESH_TTL))
  // Double-submit CSRF token: opaque, not httpOnly so client JS can read it.
  const csrf = randomToken()
  store.set(CSRF_COOKIE, csrf, {
    httpOnly: false,
    secure: isSecure(),
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TTL,
  })
}

export async function destroySession(): Promise<void> {
  const store = cookies()
  const refresh = store.get(REFRESH_COOKIE)?.value
  if (refresh) await revokeRefreshToken(refresh)
  store.delete(ACCESS_COOKIE)
  store.delete(REFRESH_COOKIE)
  store.delete(CSRF_COOKIE)
}

/* ---------------- getting the current session ---------------- */

export async function getSession(): Promise<AuthUser | null> {
  const store = cookies()
  const access = store.get(ACCESS_COOKIE)?.value
  if (access) {
    const user = await verifyAccessToken(access)
    if (user) return user
  }
  // Try silent refresh.
  const refresh = store.get(REFRESH_COOKIE)?.value
  if (!refresh) return null
  const refreshed = await doSilentRefresh(refresh)
  return refreshed
}

async function doSilentRefresh(refreshToken: string): Promise<AuthUser | null> {
  const tokenHash = await sha256(refreshToken)
  const res = await pool.query(
    `SELECT u.id, u.email, u.name, u.role
     FROM auth_sessions s
     JOIN auth_users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.revoked_at IS NULL
       AND s.expires_at > now()
       AND u.is_active = true
     LIMIT 1`,
    [tokenHash]
  )
  if (res.rowCount === 0) return null
  const row = res.rows[0]
  const user: AuthUser = {
    uid: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
  }
  // Rotate: revoke old, issue new, overwrite cookies.
  const rotated = await rotateRefreshToken(refreshToken, user)
  if (rotated) {
    const store = cookies()
    store.set(ACCESS_COOKIE, rotated.accessToken, cookieOpts(ACCESS_TTL))
    store.set(REFRESH_COOKIE, rotated.refreshToken, cookieOpts(REFRESH_TTL))
  }
  return user
}

export function getCsrfToken(): string | undefined {
  return cookies().get(CSRF_COOKIE)?.value
}

export function verifyCsrfHeader(headerValue: string | null | undefined): boolean {
  const cookie = getCsrfToken()
  if (!cookie || !headerValue) return false
  return cookie === headerValue
}

export function getSessionSync(): SessionUser | null {
  // Synchronous variant for layouts/pages that already had the old API.
  // Returns null on any failure; async callers should use getSession().
  const store = cookies()
  const access = store.get(ACCESS_COOKIE)?.value
  if (!access) return null
  // Note: jose verify is async; we cannot truly verify here synchronously.
  // For layout gating we rely on middleware (which validates the JWT).
  // This sync helper only exposes cookie presence; full verification happens
  // in middleware + getSession().
  return null
}

/* ---------------- auth actions ---------------- */

export async function authenticate(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const normalized = email.toLowerCase().trim()
  const row = await pool.query(
    `SELECT id, email, password_hash, name, role, is_active
     FROM auth_users
     WHERE email = $1
     LIMIT 1`,
    [normalized]
  )
  if (row.rowCount === 0) {
    // Also look in the legacy admin_users table (one-time sync).
    return authenticateLegacy(normalized, password)
  }
  const user = row.rows[0]
  if (!user.is_active) return null
  const ok = await verifyPassword(password, user.password_hash)
  if (!ok) return null
  // Migrate to bcrypt hash lazily if it was a legacy sha256 hash.
  if (/^[0-9a-f]{64}$/.test(user.password_hash)) {
    const newHash = await hashPassword(password)
    await pool.query(
      `UPDATE auth_users SET password_hash = $1, updated_at = now() WHERE id = $2`,
      [newHash, user.id]
    )
  }
  return {
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

async function authenticateLegacy(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const row = await pool.query(
    `SELECT id, email, password_hash, role, name
     FROM admin_users
     WHERE email = $1
     LIMIT 1`,
    [email]
  )
  if (row.rowCount === 0) return null
  const legacy = row.rows[0]
  const { createHash } = await import('crypto')
  const hash = createHash('sha256').update(password).digest('hex')
  if (hash !== legacy.password_hash) return null
  // Promote this login into auth_users lazily.
  const newHash = await hashPassword(password)
  const inserted = await pool.query(
    `INSERT INTO auth_users (email, password_hash, name, role, email_verified)
     VALUES ($1, $2, $3, $4, true)
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           updated_at = now()
     RETURNING id, email, name, role`,
    [legacy.email, newHash, legacy.name, legacy.role]
  )
  const u = inserted.rows[0]
  return { uid: u.id, email: u.email, name: u.name, role: u.role }
}

export function getCookieNames() {
  return { ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE }
}

export { ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE }
