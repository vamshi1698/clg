import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const ACCESS_COOKIE = 'nc_access'
const REFRESH_COOKIE = 'nc_refresh'

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_JWT_SECRET
  if (!raw || raw.length < 32) return new Uint8Array()
  return new TextEncoder().encode(raw)
}

async function verifyAccess(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret(), {
      issuer: 'national-college',
      audience: 'national-college-cms',
    })
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only gate /cms/* (excluding the login page itself).
  if (!pathname.startsWith('/cms')) return NextResponse.next()

  if (pathname === '/cms/login') {
    const token = req.cookies.get(ACCESS_COOKIE)?.value
    if (token && (await verifyAccess(token))) {
      return NextResponse.redirect(new URL('/cms', req.url))
    }
    return NextResponse.next()
  }

  const token = req.cookies.get(ACCESS_COOKIE)?.value
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value
  if (!token || !(await verifyAccess(token))) {
    // If we have a refresh token, let the server route rotate silently;
    // otherwise redirect to login.
    if (!refresh) {
      const url = new URL('/cms/login', req.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
    // Let the request reach the server route which will refresh or 401.
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/cms/:path*'],
}
