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

export async function middleware(req: NextRequest) {
  console.log(`[MIDDLEWARE] Running for path: ${req.nextUrl.pathname}`)

  // Get token from request
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  })

  if (!token) {
    console.log(`[MIDDLEWARE] No token found, redirecting to sign-in`)
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
  }

  console.log(`[MIDDLEWARE] Token exists`)

  try {
    if (typeof token.accessToken !== 'string') {
      console.log(`[MIDDLEWARE] Invalid access token format`)
      return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
    }

    // Decode token and check expiration
    const decodedToken = jwtDecode<DecodedToken>(token.accessToken)
    const expirationTime = decodedToken.exp * 1000
    const currentTime = Date.now()

    if (currentTime >= expirationTime) {
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
     */
    `/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sign-in).*)`,
  ],
}
