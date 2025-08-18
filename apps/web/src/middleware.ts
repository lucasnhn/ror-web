import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { JWT as NextAuthJWT } from 'next-auth/jwt'

const isDev = process.env.NODE_ENV !== 'production'

const bypassRoutes = [
  '/sign-in',
  '/sign-in-debug',
  '/auth-debug',
  '/api/auth',
  '/api/health',
  '/api/healthz',
  '/health',
  '/healthz',
]

type AppJWT = NextAuthJWT & {
  accessToken?: string
  accessTokenExpires?: number // ms
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  console.log(`[MIDDLEWARE] Running for path: ${path}`)

  const userAgent = req.headers.get('user-agent') || ''
  const isKubeProbe = userAgent.includes('kube-probe')
  const isHealthEndpoint =
    path === '/health' || path === '/healthz' || path === '/api/health' || path === '/api/healthz'

  if (isKubeProbe || isHealthEndpoint) {
    console.log(`[MIDDLEWARE] Bypassing auth for health check`)
    return NextResponse.next()
  }

  if (bypassRoutes.some((route) => path.startsWith(route))) {
    console.log(`[MIDDLEWARE] Bypassing auth for route: ${path}`)
    return NextResponse.next()
  }

  const getTokenOptions = {
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  }

  if (isDev) {
    // Avoid logging full cookie values; only names and truncated preview
    const safeCookies = Object.fromEntries(req.cookies.getAll().map((c) => [c.name, (c.value ?? '').slice(0, 8) + '…']))
    console.log(`[MIDDLEWARE] Cookies (truncated):`, safeCookies)
  }

  const token = (await getToken(getTokenOptions)) as AppJWT | null
  console.log(`[MIDDLEWARE] Token:`, token)
  console.log('[MIDDLEWARE] Token.accessToken:', token?.accessToken)
  console.log('[MIDDLEWARE] Token.accessTokenExpires:', token?.accessTokenExpires)

  if (!token) {
    console.log(`[MIDDLEWARE] No valid token found, redirecting to sign-in`)
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in?callbackUrl=${callbackUrl}`)
  }

  // Prefer your custom ms field; fall back to standard exp (seconds)
  const expMs =
    typeof token.accessTokenExpires === 'number'
      ? token.accessTokenExpires
      : typeof token.exp === 'number'
        ? token.exp * 1000
        : undefined

  if (expMs === undefined) {
    console.log(`[MIDDLEWARE] Token missing expiration, redirecting`)
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in?callbackUrl=${callbackUrl}`)
  }

  const now = Date.now()
  console.log(`[MIDDLEWARE] Token expiration:`, {
    currentTime: new Date(now).toISOString(),
    expirationTime: new Date(expMs).toISOString(),
    isExpired: now >= expMs,
    timeRemaining: `${Math.floor((expMs - now) / 1000)}s`,
  })

  if (now >= expMs) {
    console.log(`[MIDDLEWARE] Token expired, redirecting`)
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in?callbackUrl=${callbackUrl}`)
  }

  console.log(`[MIDDLEWARE] Valid session token, proceeding`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack (webpack files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - sign-in (authentication page)
     * - sign-in-debug (authentication debug page)
     * - auth-debug (debugging page)
     * - api/auth (authentication API routes)
     */
    `/((?!api|_next/static|_next/image|_next/webpack|favicon.ico|sitemap.xml|robots.txt|sign-in|sign-in-debug|auth-debug|mockServiceWorker|$).*)`,
  ],
}
