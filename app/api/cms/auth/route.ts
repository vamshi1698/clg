import { NextResponse } from 'next/server'
import { authenticate, createSession, hashPassword } from '@/lib/cms/auth'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  console.log('[CMS Login Flow] Received POST request to /api/cms/auth')
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // STEP 2: Verify OTP
  if (body.otp !== undefined) {
    const enteredOtp = String(body.otp).trim()
    console.log(`[CMS Login Flow] Verifying OTP code for email: ${email}`)

    const { data: records, error: queryErr } = await postgresClient.query(
      `SELECT * FROM otp_verifications WHERE email = $1 AND expires_at > $2 ORDER BY created_at DESC`,
      [email, new Date().toISOString()]
    )

    if (queryErr) {
      console.error('[CMS Login Flow] Database error during OTP query:', queryErr)
      return NextResponse.json({ error: 'Server database error' }, { status: 500 })
    }

    const matchedRecord = (records || []).find((r: any) => r.otp === enteredOtp)

    if (!matchedRecord) {
      console.log('[CMS Login Flow] Invalid OTP entered. Triggering Security Warning email...')

      const { sendEmail } = await import('@/lib/mail')
      const warningSubject = `[SECURITY ALERT] Failed CMS Login Attempt`
      const warningHtml = `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
          <h2 style="color: #d92727; margin-top: 0;">Security Warning: Login Attempt Alert</h2>
          <p>A login attempt for your account was successful at verifying your password, but the <strong>2FA One-Time Password verification failed</strong>.</p>
          <p>This suggests that someone else may have successfully guessed or stolen your account password, but was blocked by the 2FA system.</p>
          <p style="font-weight: bold; color: #d92727;">We highly recommend resetting your password immediately to secure your account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/cms/login" style="background-color: #d92727; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Go to CMS Portal
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #888; margin-bottom: 0;">Time of attempt: ${new Date().toLocaleString()}<br/>This is an automated security notification.</p>
        </div>
      `
      await sendEmail({
        to: email,
        subject: warningSubject,
        html: warningHtml,
      })

      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
    }

    // Delete OTP verifications to prevent reuse
    await postgresClient.query('DELETE FROM otp_verifications WHERE email = $1', [email])

    // Load admin user metadata
    const { data: user, error: userErr } = await postgresClient
      .from('admin_users')
      .select('id, email, role, name')
      .eq('email', email)
      .single()

    if (userErr || !user) {
      console.error('[CMS Login Flow] Failed to retrieve admin user after verification:', userErr)
      return NextResponse.json({ error: 'User record not found' }, { status: 400 })
    }

    const session = {
      uid: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    console.log('[CMS Login Flow] Verification SUCCESSFUL. Creating session cookie...')
    await createSession(session)
    
    console.log('[CMS Login Flow] Revalidating path layout...')
    revalidatePath('/', 'layout')
    
    console.log('[CMS Login Flow] Login process complete, returning success response')
    return NextResponse.json({ ok: true, session })
  }

  // STEP 1: Verify Password and send OTP
  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }

  console.log('[CMS Login Flow] Authenticating credentials against database...')
  const session = await authenticate(email, password)
  if (!session) {
    console.log('[CMS Login Flow] Authentication FAILED for email:', email)
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  console.log('[CMS Login Flow] Authentication SUCCESSFUL. Generating OTP code...')
  
  const otpCode = crypto.randomInt(100000, 1000000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes expiration
  
  const otpId = crypto.randomUUID()
  const { error: otpInsertErr } = await postgresClient.insert('otp_verifications', {
    id: otpId,
    email: email,
    otp: otpCode,
    expires_at: expiresAt,
    created_at: new Date().toISOString()
  })

  if (otpInsertErr) {
    console.error('[CMS Login Flow] Failed to save OTP code in database:', otpInsertErr)
    return NextResponse.json({ error: 'Failed to process login. Please try again.' }, { status: 500 })
  }

  const { sendEmail } = await import('@/lib/mail')
  const emailSubject = `CMS Login Verification - National College`
  const emailHtml = `
    <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 500px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
      <h2 style="color: #0f2d52; margin-top: 0; text-align: center;">Security Verification</h2>
      <p>A login attempt has been made for your account on the National College CMS portal.</p>
      <p>Use the following 6-digit verification code to complete your sign-in. This code is valid for <strong>5 minutes</strong>.</p>
      <div style="background-color: #f7f9fc; border: 1px solid #e1e8f0; font-size: 28px; font-weight: bold; text-align: center; padding: 15px; border-radius: 6px; letter-spacing: 5px; color: #0f2d52; margin: 20px 0;">
        ${otpCode}
      </div>
      <p style="font-size: 12px; color: #888; margin-bottom: 0;">If you did not attempt this login, please ignore this email or change your password immediately.</p>
    </div>
  `
  await sendEmail({
    to: email,
    subject: emailSubject,
    html: emailHtml
  })

  return NextResponse.json({ requireOtp: true, email })
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
  
  // Find if user already exists
  const { data: existing, error: findError } = await postgresClient
    .from('admin_users')
    .select('id, email')
    .eq('email', email)
    .single()

  if (findError && findError.code !== 'PG_NOT_FOUND' && findError.message !== 'Row not found') {
    // If it's a real database error (not just not found), handle it
    // Wait, the postgresClient single query builder returns error: null and data: null when row isn't found. Let's make sure.
  }

  let userResult
  if (existing) {
    const { data: updatedUser, error: updateError } = await postgresClient.update('admin_users', existing.id, {
      password_hash: hash,
      role,
      name,
      updated_at: new Date().toISOString()
    })
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    userResult = updatedUser
  } else {
    const { data: insertedUser, error: insertError } = await postgresClient.insert('admin_users', {
      id: crypto.randomUUID(),
      email,
      password_hash: hash,
      role,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
    userResult = insertedUser
  }

  return NextResponse.json({ ok: true, user: { id: userResult.id, email: userResult.email, name: userResult.name, role: userResult.role } })
}
