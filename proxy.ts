import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = process.env.SESSION_COOKIE || 'nc_cms_session'

// ---------------------------------------------------------------------------
// In-memory rate limiter for Edge runtime (cannot import Node.js modules)
// ---------------------------------------------------------------------------
const loginAttempts = new Map<string, number[]>()
const LOGIN_MAX_ATTEMPTS = process.env.LOGIN_MAX_ATTEMPTS ? parseInt(process.env.LOGIN_MAX_ATTEMPTS, 10) : 5
const LOGIN_WINDOW_MS = process.env.LOGIN_WINDOW_MS ? parseInt(process.env.LOGIN_WINDOW_MS, 10) : 15 * 60 * 1000 // 15 minutes

function isLoginRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = loginAttempts.get(key) || []
  const valid = timestamps.filter(t => now - t < LOGIN_WINDOW_MS)

  if (valid.length >= LOGIN_MAX_ATTEMPTS) {
    loginAttempts.set(key, valid)
    return true
  }

  valid.push(now)
  loginAttempts.set(key, valid)
  return false
}

// Periodic cleanup (runs lazily)
let lastCleanup = Date.now()
function cleanupRateLimiter() {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, timestamps] of loginAttempts.entries()) {
    const valid = timestamps.filter(t => now - t < LOGIN_WINDOW_MS)
    if (valid.length === 0) loginAttempts.delete(key)
    else loginAttempts.set(key, valid)
  }
}

// ---------------------------------------------------------------------------
// Security Headers
// ---------------------------------------------------------------------------
const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://www.google.com https://google.com https://*.google.com https://*.google.co.in",
    "media-src 'self' https: http: data: blob:",
    "connect-src 'self' https: wss: data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
}

// ---------------------------------------------------------------------------
// Session Verification (Edge-compatible, uses Web Crypto API)
// ---------------------------------------------------------------------------
async function verifyToken(token: string): Promise<boolean> {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const payload = token.slice(0, idx)
  const secret = process.env.CMS_SESSION_SECRET
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

// ---------------------------------------------------------------------------
// Main Proxy / Middleware
// ---------------------------------------------------------------------------
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Run lazy cleanup
  cleanupRateLimiter()

  // --- Rate limit login API ---
  if (pathname === '/api/cms/auth' && req.method === 'POST') {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isLoginRateLimited(ip)) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Too many login attempts. Please try again in 15 minutes.' },
          { status: 429 }
        )
      )
    }
  }

  // --- Protect CMS API routes (uploads) ---
  if (pathname.startsWith('/api/cms/') && pathname !== '/api/cms/auth' && pathname !== '/api/cms/logout') {
    const token = req.cookies.get(SESSION_COOKIE)?.value
    if (!token || !(await verifyToken(token))) {
      return applySecurityHeaders(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      )
    }
  }

  // --- CMS page routes ---
  if (pathname.startsWith('/cms')) {
    if (pathname === '/cms/login') {
      const token = req.cookies.get(SESSION_COOKIE)?.value
      if (token && (await verifyToken(token))) {
        return applySecurityHeaders(NextResponse.redirect(new URL('/cms', req.url)))
      }
      return applySecurityHeaders(NextResponse.next())
    }

    const token = req.cookies.get(SESSION_COOKIE)?.value
    if (!token || !(await verifyToken(token))) {
      const url = new URL('/cms/login', req.url)
      url.searchParams.set('from', pathname)
      return applySecurityHeaders(NextResponse.redirect(url))
    }
  }

  // --- Apply security headers to all other responses ---
  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
}
