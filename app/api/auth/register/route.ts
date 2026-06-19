import { NextResponse } from 'next/server'
import { hashPassword, setSessionCookies } from '@/lib/auth'
import { pool } from '@/lib/db/pool'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const name = String(body.name || '').trim()

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const existing = await pool.query(
    `SELECT 1 FROM auth_users WHERE email = $1`,
    [email]
  )
  if (existing.rowCount && existing.rowCount > 0) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 409 }
    )
  }

  const hash = await hashPassword(password)
  const requireVerification = process.env.AUTH_OTP_ENABLED === 'true'
  const res = await pool.query(
    `INSERT INTO auth_users (email, password_hash, name, role, email_verified)
     VALUES ($1, $2, $3, 'user', $4)
     RETURNING id, email, name, role`,
    [email, hash, name, !requireVerification]
  )
  const u = res.rows[0]
  if (!requireVerification) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || null
    const ua = req.headers.get('user-agent') || null
    await setSessionCookies(
      { uid: u.id, email: u.email, name: u.name, role: u.role },
      { ip: ip ?? undefined, userAgent: ua ?? undefined }
    )
  }
  return NextResponse.json({
    ok: true,
    requireVerification,
    user: { email: u.email, name: u.name },
  })
}
