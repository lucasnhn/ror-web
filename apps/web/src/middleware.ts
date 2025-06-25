import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

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

  console.log(`[MIDDLEWARE] Getting token with options:`, {
    hasSecret: !!(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
    secureCookie: getTokenOptions.secureCookie,
  })

  if (req.nextUrl.searchParams.has('callbackUrl')) {
    console.log(`[MIDDLEWARE] Skipping auth for callbackUrl redirect`)
    return NextResponse.next()
  }

  if (isDev) {
    console.log(`[MIDDLEWARE] Raw cookies:`, {
      all: Object.fromEntries(req.cookies.getAll().map((c) => [c.name, c.value])),
    })
  }

  const token = await getToken(getTokenOptions)

  console.log(`[MIDDLEWARE] Token:`, token)

  if (!token) {
    console.log(`[MIDDLEWARE] No valid token found, redirecting to sign-in`)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
  }

  if (!token.exp) {
    console.log(`[MIDDLEWARE] Token missing exp field, redirecting`)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
  }

  const currentTime = Date.now()
  const expirationTime = token.exp * 1000

  console.log(`[MIDDLEWARE] Token expiration:`, {
    currentTime: new Date(currentTime).toISOString(),
    expirationTime: new Date(expirationTime).toISOString(),
    isExpired: currentTime >= expirationTime,
    timeRemaining: `${Math.floor((expirationTime - currentTime) / 1000)}s`,
  })

  if (currentTime >= expirationTime) {
    console.log(`[MIDDLEWARE] Token expired, redirecting`)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
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
