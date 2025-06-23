import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
  iat?: number
  sub?: string
  email?: string
  name?: string
  [key: string]: string | number | boolean | undefined
}

// For debugging use
const isDev = process.env.NODE_ENV !== 'production'

// Routes that should bypass authentication
const bypassRoutes = [
  // Auth routes
  '/sign-in',
  '/sign-in-debug',
  '/auth-debug',
  '/api/auth',
  // Health check routes
  '/api/health',
  '/api/healthz',
  '/health',
  '/healthz',
]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Log middleware execution context
  console.log(`[MIDDLEWARE] Running for path: ${path}`)
  console.log(`[MIDDLEWARE] Environment: ${process.env.NODE_ENV}`)

  // Check if this is a Kubernetes health probe
  const userAgent = req.headers.get('user-agent') || ''
  const isKubeProbe = userAgent.includes('kube-probe')
  // Also check common health endpoints that Kubernetes might probe
  const isHealthEndpoint =
    path === '/health' || path === '/healthz' || path === '/api/health' || path === '/api/healthz'

  if (isKubeProbe || isHealthEndpoint) {
    console.log(`[MIDDLEWARE] Bypassing auth for health check: UA=${userAgent}, path=${path}`)
    return NextResponse.next()
  }

  // Skip auth for bypass routes
  if (bypassRoutes.some((route) => path.startsWith(route))) {
    console.log(`[MIDDLEWARE] Bypassing auth for route: ${path}`)
    return NextResponse.next()
  }

  // Check if cookies exist before trying to get token
  // TODO: find root cause of issue instead of quickfix

  console.log('[MIDDLEWARE] next-auth.session-token name:', req.cookies.get('next-auth.session-token')?.name)
  console.log('[MIDDLEWARE] next-auth.session-token value:', req.cookies.get('next-auth.session-token')?.value)
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token name:',
    req.cookies.get('__Secure-next-auth.session-token')?.name
  )
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token value:',
    req.cookies.get('__Secure-next-auth.session-token')?.value
  )
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token.0 name:',
    req.cookies.get('__Secure-next-auth.session-token.0')?.name
  )
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token.0 value:',
    req.cookies.get('__Secure-next-auth.session-token.0')?.value
  )
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token.1 name:',
    req.cookies.get('__Secure-next-auth.session-token.1')?.name
  )
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token.1 value:',
    req.cookies.get('__Secure-next-auth.session-token.1')?.value
  )
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token.2 name:',
    req.cookies.get('__Secure-next-auth.session-token.2')?.name
  )
  console.log(
    '[MIDDLEWARE] __Secure-next-auth.session-token.2 value:',
    req.cookies.get('__Secure-next-auth.session-token.2')?.value
  )

  console.log(`[MIDDLEWARE] Checking cookies for session token`)
  const sessionCookie =
    req.cookies.get('next-auth.session-token') ||
    req.cookies.get('__Secure-next-auth.session-token.1') ||
    req.cookies.get('__Secure-next-auth.session-token.0') ||
    req.cookies.get('__Secure-next-auth.session-token')

  console.log(`[MIDDLEWARE] Cookie check:`, {
    hasCookie: !!sessionCookie,
    cookieName: sessionCookie?.name,
    isSecure: sessionCookie?.name?.startsWith('__Secure'),
  })

  // Environment-specific configuration
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

  // Enhanced debugging in dev mode
  if (isDev) {
    console.log(`[MIDDLEWARE] Raw cookies:`, {
      all: Object.fromEntries(req.cookies.getAll().map((c) => [c.name, c.value])),
    })
  }

  // Try to get token from request with explicit cookie handling
  const tokenOptions = {
    ...getTokenOptions,
    cookieName: sessionCookie?.name, // Use the exact cookie name we found
  }

  console.log(`[MIDDLEWARE] Getting token with updated options:`, {
    ...tokenOptions,
    cookieName: tokenOptions.cookieName,
  })

  const token = await getToken(tokenOptions)

  console.log(`[MIDDLEWARE] Token:`, token)

  if (!token) {
    console.log(`[MIDDLEWARE] No token found, redirecting to sign-in`)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
  }

  console.log(`[MIDDLEWARE] Token exists with properties:`, Object.keys(token))

  try {
    console.log(`[MIDDLEWARE] Token format validation:`, {
      hasAccessToken: 'accessToken' in token,
      accessTokenType: typeof token.accessToken,
      hasExpField: 'exp' in token,
    })

    let expirationTime: number
    let tokenToValidate: string | null = null

    if (typeof token.accessToken === 'string') {
      tokenToValidate = token.accessToken
      console.log(`[MIDDLEWARE] Using accessToken string from token`)
    } else if ('exp' in token && typeof token.exp === 'number') {
      expirationTime = (token.exp as number) * 1000
      console.log(`[MIDDLEWARE] Using token's own exp field: ${token.exp}`)
    } else {
      console.log(`[MIDDLEWARE] Invalid token format - neither accessToken string nor exp field found`)
      return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
    }

    if (tokenToValidate) {
      const decodedToken = jwtDecode<DecodedToken>(tokenToValidate)

      if (!decodedToken.exp) {
        console.log(`[MIDDLEWARE] Token missing exp claim`)
        return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
      }

      expirationTime = decodedToken.exp * 1000
      console.log(`[MIDDLEWARE] Decoded token exp: ${decodedToken.exp}`)
    }

    const currentTime = Date.now()
    console.log(`[MIDDLEWARE] Token expiration:`, {
      currentTime: new Date(currentTime).toISOString(),
      expirationTime: new Date(expirationTime!).toISOString(),
      isExpired: currentTime >= expirationTime!,
      timeRemaining: `${Math.floor((expirationTime! - currentTime) / 1000)}s`,
    })

    if (currentTime >= expirationTime!) {
      console.log(`[MIDDLEWARE] Token expired, redirecting to sign-in`)
      return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
    }
  } catch (error) {
    console.error(`[MIDDLEWARE] Error processing token:`, error)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
  }

  console.log(`[MIDDLEWARE] Token valid, proceeding`)
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
