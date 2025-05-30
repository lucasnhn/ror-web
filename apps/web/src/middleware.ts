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

// Debug route patterns that should bypass authentication
const debugRoutes = [
  '/sign-in',
  '/sign-in-debug',
  '/auth-debug',
  '/api/auth', // This covers all auth routes including callbacks
]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Log middleware execution context
  console.log(`[MIDDLEWARE] Running for path: ${path}`)
  console.log(`[MIDDLEWARE] Environment: ${process.env.NODE_ENV}`)

  // Skip auth for debug routes
  if (debugRoutes.some((route) => path.startsWith(route))) {
    console.log(`[MIDDLEWARE] Bypassing auth for debug route: ${path}`)
    return NextResponse.next()
  }

  // Check if cookies exist before trying to get token
  const sessionCookie =
    req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token')

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

  if (!token) {
    console.log(`[MIDDLEWARE] No token found, redirecting to sign-in`)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
  }

  console.log(`[MIDDLEWARE] Token exists with properties:`, Object.keys(token))

  try {
    // Check for possible token formats - production vs development may differ
    console.log(`[MIDDLEWARE] Token format validation:`, {
      hasAccessToken: 'accessToken' in token,
      accessTokenType: typeof token.accessToken,
      hasExpField: 'exp' in token,
    })

    let expirationTime: number
    let tokenToValidate: string | null = null

    // Handle different token structures we might encounter
    if (typeof token.accessToken === 'string') {
      // Standard case: token has an accessToken string that needs decoding
      tokenToValidate = token.accessToken
      console.log(`[MIDDLEWARE] Using accessToken string from token`)
    } else if ('exp' in token && typeof token.exp === 'number') {
      // Alternative case: token itself is already decoded and has exp
      expirationTime = (token.exp as number) * 1000
      console.log(`[MIDDLEWARE] Using token's own exp field: ${token.exp}`)
    } else {
      // Unknown format
      console.log(`[MIDDLEWARE] Invalid token format - neither accessToken string nor exp field found`)
      return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
    }

    // If we have a token string, decode it to check expiration
    if (tokenToValidate) {
      const decodedToken = jwtDecode<DecodedToken>(tokenToValidate)

      if (!decodedToken.exp) {
        console.log(`[MIDDLEWARE] Token missing exp claim`)
        return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
      }

      expirationTime = decodedToken.exp * 1000
      console.log(`[MIDDLEWARE] Decoded token exp: ${decodedToken.exp}`)
    }

    // Check expiration
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - sign-in (authentication page)
     * - sign-in-debug (authentication debug page)
     * - auth-debug (debugging page)
     * - api/auth (authentication API routes)
     */
    `/((?!api|_next/static|_next/image|_next/webpack|favicon.ico|sitemap.xml|robots.txt|sign-in|sign-in-debug|auth-debug|mockServiceWorker).*)`,
  ],
}
