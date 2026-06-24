import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'nc_cms_session'

async function verifyToken(token: string): Promise<boolean> {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const payload = token.slice(0, idx)
  const secret = process.env.CMS_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) return false

  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const payloadData = encoder.encode(payload)
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      payloadData
    )
    const hashArray = Array.from(new Uint8Array(signatureBuffer))
    const sig = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return token === `${payload}.${sig}`
  } catch (e) {
    console.error('verifyToken error:', e)
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/cms')) return NextResponse.next()
  if (pathname === '/cms/login') {
    const token = req.cookies.get(SESSION_COOKIE)?.value
    if (token && (await verifyToken(token))) {
      return NextResponse.redirect(new URL('/cms', req.url))
    }
    return NextResponse.next()
  }
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyToken(token))) {
    const url = new URL('/cms/login', req.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/cms/:path*'],
}

