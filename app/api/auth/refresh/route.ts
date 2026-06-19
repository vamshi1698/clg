import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  REFRESH_COOKIE,
  ACCESS_COOKIE,
  rotateRefreshToken,
  getSession,
} from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const store = cookies()
  const refresh = store.get(REFRESH_COOKIE)?.value
  if (!refresh) {
    return NextResponse.json({ error: 'No session' }, { status: 401 })
  }
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 })
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || null
  const ua = req.headers.get('user-agent') || null
  const rotated = await rotateRefreshToken(refresh, user, { ip: ip ?? undefined, userAgent: ua ?? undefined })
  if (!rotated) {
    return NextResponse.json({ error: 'Session invalid' }, { status: 401 })
  }
  store.set(ACCESS_COOKIE, rotated.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })
  store.set(REFRESH_COOKIE, rotated.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return NextResponse.json({ ok: true })
}
