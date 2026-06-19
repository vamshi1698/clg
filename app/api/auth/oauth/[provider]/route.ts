import { NextResponse, type NextRequest } from 'next/server'
import { pool } from '@/lib/db/pool'

export const runtime = 'nodejs'

const PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userinfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scopes: ['openid', 'email', 'profile'],
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userinfoUrl: 'https://api.github.com/user',
    scopes: ['read:user', 'user:email'],
  },
} as const

type ProviderName = keyof typeof PROVIDERS

function isValidProvider(p: string | undefined): p is ProviderName {
  return !!p && p in PROVIDERS
}

async function randomState(): Promise<string> {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Buffer.from(bytes).toString('base64url')
}

export async function GET(req: NextRequest, { params }: { params: { provider: string } }) {
  const providerParam = params.provider as string
  if (!isValidProvider(providerParam)) {
    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
  }
  const provider = providerParam
  const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`]
  const clientSecret = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`]
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: `OAuth ${provider} is not configured` },
      { status: 501 }
    )
  }

  const state = await randomState()
  const returnPath = req.nextUrl.searchParams.get('from') || '/cms'
  await pool.query(
    `INSERT INTO oauth_states (state, provider, return_path) VALUES ($1, $2, $3)`,
    [state, provider, returnPath]
  )

  const cfg = PROVIDERS[provider]
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/${provider}`
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: cfg.scopes.join(' '),
  })
  const authUrl = `${cfg.authUrl}?${query.toString()}`
  return NextResponse.redirect(authUrl)
}
