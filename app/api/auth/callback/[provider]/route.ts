import { NextResponse, type NextRequest } from 'next/server'
import { pool } from '@/lib/db/pool'
import { setSessionCookies } from '@/lib/auth'

export const runtime = 'nodejs'

const PROVIDERS = {
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userinfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  github: {
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userinfoUrl: 'https://api.github.com/user',
  },
} as const

type ProviderName = keyof typeof PROVIDERS

function isValidProvider(p: string | undefined): p is ProviderName {
  return !!p && p in PROVIDERS
}

interface ProviderUserInfo {
  providerUserId: string
  email: string
  name: string
}

async function exchangeAndFetch(
  provider: ProviderName,
  code: string,
  redirectUri: string
): Promise<ProviderUserInfo | null> {
  const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`]
  const clientSecret = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`]
  if (!clientId || !clientSecret) return null

  const cfg = PROVIDERS[provider]
  const tokenRes = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  if (!tokenRes.ok) return null
  const tokenBody = await tokenRes.json()
  const accessToken = tokenBody.access_token as string | undefined
  if (!accessToken) return null

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  }
  const userRes = await fetch(cfg.userinfoUrl, { headers })
  if (!userRes.ok) return null
  const userInfo = await userRes.json()

  if (provider === 'google') {
    return {
      providerUserId: String(userInfo.sub),
      email: String(userInfo.email ?? '').toLowerCase(),
      name: String(userInfo.name ?? userInfo.email ?? 'User'),
    }
  }
  // GitHub: the user object may not include email; fetch separately if missing.
  let email = String(userInfo.email ?? '').toLowerCase()
  if (!email) {
    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers,
    })
    if (emailRes.ok) {
      const emails = (await emailRes.json()) as Array<{
        email: string
        primary: boolean
        verified: boolean
      }>
      const primary = emails.find((e) => e.primary && e.verified)
      if (primary) email = primary.email.toLowerCase()
    }
  }
  return {
    providerUserId: String(userInfo.id),
    email,
    name: String(userInfo.name ?? userInfo.login ?? 'GitHub User'),
  }
}

export async function GET(req: NextRequest, { params }: { params: { provider: string } }) {
  const providerParam = params.provider as string
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  if (!isValidProvider(providerParam) || !code || !state) {
    return NextResponse.redirect(new URL('/cms/login?error=oauth_invalid', req.url))
  }
  const provider = providerParam

  const stateRow = await pool.query(
    `SELECT return_path FROM oauth_states WHERE state = $1 AND provider = $2`,
    [state, provider]
  )
  if (stateRow.rowCount === 0) {
    return NextResponse.redirect(new URL('/cms/login?error=oauth_state', req.url))
  }
  await pool.query(`UPDATE oauth_states SET consumed_at = now() WHERE state = $1`, [
    state,
  ])
  const returnPath = stateRow.rows[0].return_path || '/cms'

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/${provider}`
  const info = await exchangeAndFetch(provider, code, redirectUri)
  if (!info || !info.email) {
    return NextResponse.redirect(
      new URL('/cms/login?error=oauth_userinfo', req.url)
    )
  }

  // 1) Existing link: login as that user.
  const existingLink = await pool.query(
    `SELECT user_id FROM oauth_accounts
     WHERE provider = $1 AND provider_user_id = $2
     LIMIT 1`,
    [provider, info.providerUserId]
  )
  let userId: string
  if (existingLink.rowCount && existingLink.rowCount > 0) {
    userId = existingLink.rows[0].user_id
  } else {
    // 2) No link; find or create a user by email, then link.
    const existingUser = await pool.query(
      `SELECT id FROM auth_users WHERE email = $1`,
      [info.email]
    )
    if (existingUser.rowCount && existingUser.rowCount > 0) {
      userId = existingUser.rows[0].id
    } else {
      const { hashPassword } = await import('@/lib/auth')
      const randomPassword =
        Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      const hash = await hashPassword(randomPassword)
      const created = await pool.query(
        `INSERT INTO auth_users (email, password_hash, name, role, email_verified)
         VALUES ($1, $2, $3, 'user', true)
         RETURNING id`,
        [info.email, hash, info.name]
      )
      userId = created.rows[0].id
    }
    await pool.query(
      `INSERT INTO oauth_accounts (user_id, provider, provider_user_id, access_token)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (provider, provider_user_id) DO NOTHING`,
      [userId, provider, info.providerUserId, code]
    )
  }

  const userRes = await pool.query(
    `SELECT id, email, name, role FROM auth_users WHERE id = $1`,
    [userId]
  )
  const u = userRes.rows[0]
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || null
  const ua = req.headers.get('user-agent') || null
  await setSessionCookies(
    { uid: u.id, email: u.email, name: u.name, role: u.role },
    { ip: ip ?? undefined, userAgent: ua ?? undefined }
  )

  return NextResponse.redirect(new URL(returnPath, req.url))
}
