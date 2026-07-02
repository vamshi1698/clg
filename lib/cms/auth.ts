import { cookies } from 'next/headers'
import crypto from 'crypto'
import { postgresClient } from '../postgres/client'

export const SESSION_COOKIE = process.env.SESSION_COOKIE || 'nc_cms_session'

export interface CmsSession {
  uid: string
  email: string
  name: string
  role: string
}

function signToken(payload: string): string {
  const secret = process.env.CMS_SESSION_SECRET
  if (!secret) {
    throw new Error('CMS_SESSION_SECRET is not configured in environment variables')
  }
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${sig}`
}

function verifyToken(token: string): string | null {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return null
  const payload = token.slice(0, idx)
  const expected = signToken(payload)
  return token === expected ? payload : null
}

// Naive hash compatible with seeded users (bcrypt if available, else sha256).
// We store users with sha256 hashes for portability in this environment.
export async function hashPassword(password: string): Promise<string> {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  console.log('[CMS Auth] Generated SHA-256 password hash')
  return hash
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  console.log('[CMS Auth] Computing hash of entered password...')
  const h = await hashPassword(password)
  const isMatch = h === stored
  console.log(`[CMS Auth] Hash match result: ${isMatch} (Entered: ${h.slice(0, 8)}..., Stored: ${stored.slice(0, 8)}...)`)
  return isMatch
}

export async function createSession(user: CmsSession) {
  const payload = JSON.stringify(user)
  const token = signToken(Buffer.from(payload).toString('base64'))
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 1, // 1 hour
  })
}

export async function destroySession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<CmsSession | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
    return decoded as CmsSession
  } catch {
    return null
  }
}

export async function authenticate(email: string, password: string): Promise<CmsSession | null> {
  console.log(`[CMS Auth] Querying admin_users table in local Postgres for: ${email}`)
  const { data, error } = await postgresClient
    .from('admin_users')
    .select('id, email, password_hash, role, name')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (error) {
    console.error('[CMS Auth] Database query error:', error)
    return null
  }

  if (!data) {
    console.log('[CMS Auth] User record not found in local database for email:', email)
    return null
  }

  console.log('[CMS Auth] User record found. Verifying password...')
  const ok = await verifyPassword(password, data.password_hash)
  if (!ok) {
    console.log('[CMS Auth] Password verification failed')
    return null
  }

  console.log('[CMS Auth] Password verified successfully')
  return {
    uid: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
  }
}
