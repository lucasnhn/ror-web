import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * This is a diagnostic endpoint to check authentication state.
 * It shows cookie information to help debug auth issues.
 */
export async function GET() {
  try {
    // Analyze cookies for debugging
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll().map((c) => ({
      name: c.name,
      value:
        c.name.includes('token') || c.name.includes('state')
          ? `${c.value.substring(0, 10)}...`
          : c.value.substring(0, Math.min(c.value.length, 20)) + (c.value.length > 20 ? '...' : ''),
    }))

    // Check for session cookies specifically
    const sessionCookie =
      cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token')

    return NextResponse.json({
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
        AUTH_ISSUER: process.env.AUTH_ISSUER || 'not set',
      },
    })
  } catch (error) {
    console.error('Cookie diagnostic error:', error)
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
