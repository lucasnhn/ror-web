import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  // Use await with cookies() since it returns a Promise
  const cookieStore = await cookies()

  // Check both possible cookie names based on environment
  const sessionCookie =
    cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token')

  // Log all cookies for debugging
  const allCookies = cookieStore.getAll().map((c) => ({
    name: c.name,
    value: (c.value || '').substring(0, 20) + '...',
  }))

  console.log('[ENV DEBUG] All cookies:', allCookies)

  if (!sessionCookie) {
    return NextResponse.json({
      tokenExists: false,
      error: 'No session cookie found',
      cookies: allCookies,
      environment: {
        AUTH_SECRET: process.env.AUTH_SECRET ? '✓ Set' : '✗ Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Not set',
        AUTH_ISSUER: process.env.AUTH_ISSUER,
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  }

  try {
    return NextResponse.json({
      tokenExists: true,
      cookieName: sessionCookie.name,
      cookieValue: sessionCookie.value,
      environment: {
        AUTH_SECRET: process.env.AUTH_SECRET ? '✓ Set' : '✗ Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Not set',
        AUTH_ISSUER: process.env.AUTH_ISSUER,
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze environment', details: String(error) }, { status: 500 })
  }
}
