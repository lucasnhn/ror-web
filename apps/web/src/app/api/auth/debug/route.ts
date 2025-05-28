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
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET })

  if (!token) {
    console.log('[DEBUG] No token found')
    return NextResponse.json({ error: 'No token found' }, { status: 401 })
  }

  try {
    const accessToken = token.accessToken
    if (typeof accessToken !== 'string' || !accessToken) {
      console.log('[DEBUG] Invalid or missing access token in session')
      return NextResponse.json({ error: 'Invalid or missing access token in session' }, { status: 401 })
    }

    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    const expirationTime = decodedToken.exp * 1000
    const currentTime = Date.now()

    return NextResponse.json({
      tokenExists: !!token,
      expirationTime: new Date(expirationTime).toISOString(),
      currentTime: new Date(currentTime).toISOString(),
      isExpired: currentTime >= expirationTime,
      timeUntilExpiry: expirationTime - currentTime,
      decodedToken,
      token,
    })
  } catch (error) {
    console.error('[DEBUG] Failed to decode token', error)
    return NextResponse.json({ error: 'Failed to decode token', details: String(error) }, { status: 500 })
  }
}
