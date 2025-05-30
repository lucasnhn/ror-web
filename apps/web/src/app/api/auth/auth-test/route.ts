import { NextResponse } from 'next/server'
import { auth } from '@/config/next-auth'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

/**
 * This is a comprehensive test endpoint to help verify the authentication flow.
 * It provides detailed diagnostics about the current authentication state.
 */
export async function GET() {
  try {
    // Get session through normal auth method
    const session = await auth()

    // Analyze cookies for debugging
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll().map((c) => ({
      name: c.name,
      value: c.name.includes('token') ? `${c.value.substring(0, 10)}...` : c.value.substring(0, 5) + '...',
      path: c.path,
      expires: c.expires,
    }))

    // Check for session cookies specifically
    const sessionCookie =
      cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token')

    if (!session) {
      return NextResponse.json({
        status: 'unauthenticated',
        message: 'No session found',
        timestamp: new Date().toISOString(),
        cookies: {
          count: allCookies.length,
          hasSessionCookie: !!sessionCookie,
          sessionCookieName: sessionCookie?.name,
          all: allCookies,
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV || 'unknown',
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
          hasAuthSecret: !!process.env.NEXTAUTH_SECRET || !!process.env.AUTH_SECRET,
        },
      })
    }

    // Analyze token if available
    let tokenInfo = {}
    if (session.accessToken) {
      try {
        const decodedToken = jwtDecode(session.accessToken)
        tokenInfo = {
          sub: decodedToken.sub,
          exp: decodedToken.exp,
          expiresAt: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : 'unknown',
          iat: decodedToken.iat,
          issuedAt: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : 'unknown',
        }
      } catch {
        tokenInfo = { error: 'Failed to decode token' }
      }
    }

    // Return session info without exposing the full token
    return NextResponse.json({
      status: 'authenticated',
      user: session.user,
      hasAccessToken: !!session.accessToken,
      // Only return the first few characters of the token for verification
      tokenPreview: session.accessToken ? `${session.accessToken.substring(0, 10)}...` : 'No token',
      tokenInfo,
      cookies: {
        count: allCookies.length,
        hasSessionCookie: !!sessionCookie,
        sessionCookieName: sessionCookie?.name,
        all: allCookies,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'unknown',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
        hasAuthSecret: !!process.env.NEXTAUTH_SECRET || !!process.env.AUTH_SECRET,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
