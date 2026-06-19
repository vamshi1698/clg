import { NextResponse } from 'next/server'
import {
  authenticate,
  setSessionCookies,
  hashPassword,
} from '@/lib/auth'
import { pool } from '@/lib/db/pool'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const user = await authenticate(email, password)
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || null
  const userAgent = req.headers.get('user-agent') || null
  await setSessionCookies(user, { ip: ip ?? undefined, userAgent: userAgent ?? undefined })
  await pool.query(
    `INSERT INTO audit_log (user_id, action, ip, user_agent) VALUES ($1, 'login', $2::inet, $3)`,
    [user.uid, ip, userAgent]
  )
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true, user })
}

/** Bootstrap the first admin user; protected by CMS_SETUP_SECRET. */
export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}))
  const secret = process.env.CMS_SETUP_SECRET
  if (!secret || body.setup_secret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const name = String(body.name || '')
  const role =
    body.role === 'content_admin' || body.role === 'exam_admin'
      ? body.role
      : 'super_admin'

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const hash = await hashPassword(password)
  const res = await pool.query(
    `INSERT INTO auth_users (email, password_hash, name, role, email_verified)
     VALUES ($1, $2, $3, $4, true)
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           name = EXCLUDED.name,
           updated_at = now()
     RETURNING id, email, name, role`,
    [email, hash, name, role]
  )
  return NextResponse.json({ ok: true, user: res.rows[0] })
}
