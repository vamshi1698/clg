import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { pool } from '@/lib/db/pool'
import { setSessionCookies } from '@/lib/auth'

export const runtime = 'nodejs'

async function sha256(input: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(input).digest('hex')
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const code = String(body.code || '').trim()

  if (!email || !code) {
    return NextResponse.json({ error: 'Email and code required' }, { status: 400 })
  }

  const codeHash = await sha256(code)

  const res = await pool.query(
    `SELECT id, user_id, purpose, attempts, expires_at
     FROM otp_codes
     WHERE email = $1 AND code_hash = $2 AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, codeHash]
  )

  if (res.rowCount === 0) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }
  const row = res.rows[0]
  if (new Date(row.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Code expired' }, { status: 400 })
  }
  if (row.attempts >= 5) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  await pool.query(
    `UPDATE otp_codes SET consumed_at = now() WHERE id = $1`,
    [row.id]
  )

  if (!row.user_id) {
    // User hasn't registered yet; signal caller to set up their account.
    return NextResponse.json({
      ok: true,
      requiresRegistration: true,
      email,
    })
  }

  const userQuery = await pool.query(
    `UPDATE auth_users
     SET email_verified = true, is_active = true, updated_at = now()
     WHERE id = $1
     RETURNING id, email, name, role`,
    [row.user_id]
  )
  const u = userQuery.rows[0]
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || null
  const ua = req.headers.get('user-agent') || null
  await setSessionCookies(
    { uid: u.id, email: u.email, name: u.name, role: u.role },
    { ip: ip ?? undefined, userAgent: ua ?? undefined }
  )

  // Touch the cookie store so the response includes the Set-Cookie headers.
  void cookies()

  return NextResponse.json({
    ok: true,
    requiresRegistration: false,
    user: { email: u.email, name: u.name, role: u.role },
  })
}

/** Increment attempts when verification fails via earlier return path. */
