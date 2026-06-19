import { NextResponse } from 'next/server'
import { authenticate, createSession, hashPassword, adminClient } from '@/lib/cms/auth'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const session = await authenticate(email, password)
  if (!session) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  await createSession(session)
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true, session })
}

// Helper route to create an admin (used for bootstrapping; protected by secret)
export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}))
  const secret = process.env.CMS_SETUP_SECRET
  if (!secret || body.setup_secret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const name = String(body.name || '')
  const role = body.role === 'content_admin' || body.role === 'exam_admin' ? body.role : 'super_admin'

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const hash = await hashPassword(password)
  const supabase = adminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .upsert({ email, password_hash: hash, role, name }, { onConflict: 'email' })
    .select('id, email, name, role')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, user: data })
}
