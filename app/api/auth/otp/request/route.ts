import { NextResponse } from 'next/server'
import { pool } from '@/lib/db/pool'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function sha256(input: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(input).digest('hex')
}

function code6(): string {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  return String((bytes[0] % 10).toString() + (bytes[1] % 10) + (bytes[2] % 10) + (bytes[3] % 10) + (bytes[1] % 10) + (bytes[2] % 10)).slice(0, 6)
}

async function sendEmail(to: string, subject: string, text: string) {
  const endpoint = process.env.AUTH_SMTP_API_URL
  const apiKey = process.env.AUTH_SMTP_API_KEY
  const from = process.env.AUTH_SMTP_FROM
  if (!endpoint || !apiKey || !from) {
    // Dev/local: print the code to server console so you can complete the flow.
    console.log(`[OTP/email disabled] To: ${to}, Subject: ${subject}\n${text}`)
    return
  }
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const purpose =
    body.purpose === 'email_verify' || body.purpose === 'password_reset'
      ? body.purpose
      : 'login'

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const userRes = await pool.query(
    `SELECT id FROM auth_users WHERE email = $1`,
    [email]
  )
  const userId = userRes.rowCount && userRes.rowCount > 0 ? userRes.rows[0].id : null

  const code = code6()
  const codeHash = await sha256(code)

  await pool.query(
    `INSERT INTO otp_codes (user_id, email, code_hash, purpose, expires_at)
     VALUES ($1, $2, $3, $4, now() + interval '10 minutes')`,
    [userId, email, codeHash, purpose]
  )

  const subjectMap: Record<string, string> = {
    login: 'Your National College login code',
    email_verify: 'Verify your email',
    password_reset: 'Your password reset code',
  }
  await sendEmail(
    email,
    subjectMap[purpose],
    `Your verification code is ${code}. It expires in 10 minutes.`
  )

  // Never reveal whether the email exists; respond identically.
  return NextResponse.json({ ok: true })
}
