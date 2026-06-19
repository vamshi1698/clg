import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const SESSION_COOKIE = 'nc_cms_session'

export interface CmsSession {
  uid: string
  email: string
  name: string
  role: string
}

function signToken(payload: string): string {
  const secret = process.env.CMS_SESSION_SECRET || serviceRoleKey
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

export function adminClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Naive hash compatible with seeded users (bcrypt if available, else sha256).
// We store users with sha256 hashes for portability in this environment.
export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const h = await hashPassword(password)
  return h === stored
}

export async function createSession(user: CmsSession) {
  const payload = JSON.stringify(user)
  const token = signToken(Buffer.from(payload).toString('base64'))
  const store = cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  })
}

export function destroySession() {
  const store = cookies()
  store.delete(SESSION_COOKIE)
}

export function getSession(): CmsSession | null {
  const store = cookies()
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
  const supabase = adminClient()
  const { data } = await supabase
    .from('admin_users')
    .select('id, email, password_hash, role, name')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!data) return null
  const ok = await verifyPassword(password, data.password_hash)
  if (!ok) return null

  return {
    uid: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
  }
}
