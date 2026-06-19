import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'
import { pool } from '@/lib/db/pool'

export const runtime = 'nodejs'

export async function POST() {
  await destroySession()
  try {
    await pool.query(`INSERT INTO audit_log (action) VALUES ('logout')`)
  } catch {
    /* non-critical */
  }
  return NextResponse.json({ ok: true })
}
