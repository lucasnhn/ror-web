import { getToken } from 'next-auth/jwt'
import { jwtDecode } from 'jwt-decode'
import { NextRequest, NextResponse } from 'next/server'

interface DecodedToken {
  exp: number
  iat?: number
  sub?: string
  email?: string
  name?: string
  [key: string]: string | number | boolean | undefined
}

export async function GET(req: NextRequest) {
  // Log all cookies for debugging
  console.log(
    '[DEBUG] All cookies:',
    Object.fromEntries(req.cookies.getAll().map((c) => [c.name, c.value.substring(0, 20) + '...']))
  )

  // Log request URL
  console.log('[DEBUG] Request URL:', req.url)

  // Find the right cookie name
  const sessionCookie =
    req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token')

  // Try different approaches to get the token
  console.log('[DEBUG] Trying to get token with cookie name:', sessionCookie?.name)

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
    cookieName: sessionCookie?.name,
  })

  if (!token) {
    console.log('[DEBUG] No token found in request')
    return NextResponse.json({
      tokenExists: false,
      error: 'No token found',
    })
  }

  console.log('[DEBUG] Token structure:', {
    keys: Object.keys(token),
    accessTokenType: typeof token.accessToken,
    hasExp: 'exp' in token,
  })

  try {
    let decodedToken: DecodedToken | undefined
    let expirationTime: number | undefined

    // Handle different token formats
    if (typeof token.accessToken === 'string') {
      // Standard case - token has an accessToken that needs decoding
      console.log('[DEBUG] Found string accessToken in token')
      decodedToken = jwtDecode<DecodedToken>(token.accessToken)
      expirationTime = decodedToken.exp * 1000
    } else if ('exp' in token && typeof token.exp === 'number') {
      // Token itself contains exp claim
      console.log('[DEBUG] Using exp from token directly')
      expirationTime = (token.exp as number) * 1000
      decodedToken = token as unknown as DecodedToken
    } else {
      console.log('[DEBUG] Unusual token format, dumping structure:', token)
      return NextResponse.json({
        tokenExists: true,
        error: 'Unrecognized token format',
        token,
      })
    }

    const currentTime = Date.now()

    return NextResponse.json({
      tokenExists: true,
      expirationTime: expirationTime ? new Date(expirationTime).toISOString() : undefined,
      currentTime: new Date(currentTime).toISOString(),
      isExpired: expirationTime ? currentTime >= expirationTime : undefined,
      timeUntilExpiry: expirationTime ? expirationTime - currentTime : undefined,
      decodedToken,
      token,
    })
  } catch (error) {
    console.error('[DEBUG] Failed to decode token', error)
    return NextResponse.json({ error: 'Failed to decode token', details: String(error) }, { status: 500 })
  }
}
