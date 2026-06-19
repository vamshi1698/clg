import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

const SESSION_COOKIE = 'nc_cms_session'

function verifyToken(token: string): boolean {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const payload = token.slice(0, idx)
  const secret = process.env.CMS_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) return false
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return token === `${payload}.${sig}`
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/cms')) return NextResponse.next()
  if (pathname === '/cms/login') {
    const token = req.cookies.get(SESSION_COOKIE)?.value
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/cms', req.url))
    }
    return NextResponse.next()
  }
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !verifyToken(token)) {
    const url = new URL('/cms/login', req.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/cms/:path*'],
}
