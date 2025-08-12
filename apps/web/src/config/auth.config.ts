import { Session, type NextAuthConfig } from 'next-auth'
import { Provider } from 'next-auth/providers'
import { jwtDecode } from 'jwt-decode'
import { env } from '@/config/env'
import { routes } from './routes'
import type { JWT } from 'next-auth/jwt'

const dexIdpProvider: Provider = {
  type: 'oidc',
  id: 'dex',
  name: 'dex',
  issuer: env.AUTH_ISSUER,
  clientId: env.AUTH_CLIENT_ID,
  clientSecret: env.AUTH_CLIENT_SECRET,
  authorization: {
    params: {
      scope: 'openid profile email groups offline_access', // Added offline_access
      response_type: 'code',
    },
  },
  checks: ['pkce', 'state'],
  client: {
    token_endpoint_auth_method: 'client_secret_basic',
  },
  profile(profile) {
    console.log('[AUTH CONFIG] Profile received from Dex:', profile)
    return {
      id: profile.sub,
      name: profile.name || profile.preferred_username || profile.sub,
      email: profile.email,
      image: profile.picture,
      emailVerified: null,
    }
  },
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number // epoch millis
    error?: 'RefreshAccessTokenError'
  }
}

const trusthost = Boolean(JSON.parse(env.AUTH_TRUST_HOST))

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    accessToken: string
    error?: 'RefreshAccessTokenError' // added this
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
  }
}

// Add helper function to refresh token
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      return { ...token, error: 'RefreshAccessTokenError' as const }
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
      client_id: env.AUTH_CLIENT_ID,
      client_secret: env.AUTH_CLIENT_SECRET,
    })

    const res = await fetch(`${env.AUTH_ISSUER}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[AUTH CONFIG] refreshAccessToken failed:', res.status, text)
      return { ...token, error: 'RefreshAccessTokenError' as const }
    }

    const refreshed = await res.json()
    const nextAccess = refreshed.access_token ?? token.accessToken
    const nextRefresh = refreshed.refresh_token ?? token.refreshToken
    const expiresInSec: number | undefined = refreshed.expires_in

    // Find expiry in ms
    const nextExpires =
      typeof expiresInSec === 'number'
        ? Date.now() + expiresInSec * 1000
        : (() => {
            try {
              const decoded = jwtDecode<{ exp?: number }>(nextAccess!)
              return decoded?.exp ? decoded.exp * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days if no exp
            } catch {
              return Date.now() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days if decoding fails
            }
          })()

    return {
      ...token,
      accessToken: nextAccess,
      refreshToken: nextRefresh,
      accessTokenExpires: nextExpires,
      error: undefined,
    }
  } catch (error) {
    console.error('[AUTH CONFIG] refreshAccessToken exception:', error)
    return { ...token, error: 'RefreshAccessTokenError' as const }
  }
}

export const authConfig: NextAuthConfig = {
  providers: [dexIdpProvider],
  trustHost: trusthost,
  debug: process.env.NODE_ENV !== 'production',

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  pages: {
    signIn: routes.auth.signIn.getHref(),
    error: '/auth-debug',
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token as string | undefined // added this
        // added this
        const expMs =
          typeof account.expires_in === 'number'
            ? Date.now() + account.expires_in * 1000
            : (() => {
                try {
                  const decoded = jwtDecode<{ exp?: number }>(account.access_token!)
                  return decoded?.exp ? decoded.exp * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days if no exp
                } catch {
                  return Date.now() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days if decoding fails
                }
              })()
        token.accessTokenExpires = expMs // added this
        return token // moved this inside if
      }

      // added this
      if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // added this
      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user = {
        id: (token.sub as string) ?? '', // changed this
        name: (token.name as string) ?? null, // changed this
        email: (token.email as string) ?? null, // changed this
        image: null,
        emailVerified: null,
      }
      if (token.error) session.error = token.error // added this
      return session
    },

    async authorized({ request, auth }) {
      if (request.method === 'POST') {
        return validateAuthToken(auth)
      }

      return !!auth?.user
    },
  },
}

function validateAuthToken(session: Session | null): boolean {
  if (!session?.accessToken) {
    console.log('[AUTH CONFIG] validateAuthToken: No accessToken in session')
    return false
  }

  try {
    const decoded = jwtDecode<{ exp?: number }>(session.accessToken) // changed this

    if (typeof decoded.exp !== 'number') {
      console.warn('[AUTH CONFIG] validateAuthToken: Token missing expiration')
      return false
    }

    // const expirationTime = decoded.exp * 1000

    // const now = Date.now()
    // return expirationTime >= now

    // changed the return over to this
    return decoded.exp * 1000 >= Date.now()
  } catch (error) {
    console.error('[AUTH CONFIG] Error validating token:', error)
    return false
  }
}
