import { NextResponse } from 'next/server'
import { pool } from '@/lib/db/pool'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const phone = String(body.phone || '').trim() || null
  const subject = String(body.subject || '').trim() || null
  const message = String(body.message || '').trim()

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required' },
      { status: 400 }
    )
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, 'unread')`,
      [name, email, phone, subject, message]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
