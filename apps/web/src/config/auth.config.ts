import { Session, type NextAuthConfig } from 'next-auth'
import { Provider } from 'next-auth/providers'
import { jwtDecode } from 'jwt-decode'
import { env } from '@/config/env'
import { routes } from './routes'

/**
 * DexIDP provider configuration
 */
const dexIdpProvider: Provider = {
  type: 'oidc',
  id: 'dex',
  name: 'dex',
  issuer: env.AUTH_ISSUER,
  clientId: env.AUTH_CLIENT_ID,
  clientSecret: env.AUTH_CLIENT_SECRET,
  authorization: {
    params: {
      scope: 'openid profile email groups',
      response_type: 'code',
    },
  },
  checks: ['pkce', 'state'],
  client: {
    token_endpoint_auth_method: 'client_secret_basic',
  },
  profile(profile) {
    console.log('[NEXTAUTH] Profile received from Dex:', profile)
    return {
      id: profile.sub,
      name: profile.name || profile.preferred_username || profile.sub,
      email: profile.email,
      image: profile.picture,
      emailVerified: null,
    }
  },
}

const trusthost = Boolean(JSON.parse(env.AUTH_TRUST_HOST))

declare module 'next-auth' {
  interface Session {
    accessToken: string
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
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 30 * 24 * 60 * 60,
      },
    },
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
      if (account?.provider === 'dex') {
        if (!account.access_token) {
          console.error('[NEXTAUTH] Missing access_token in account data')
          throw new Error('Did not receive access_token from DexIdp on login callback')
        }

        try {
          const decoded = jwtDecode(account.access_token)
          console.log('[NEXTAUTH] Decoded access token:', decoded)

          return {
            ...token,
            accessToken: account.access_token,
            exp: decoded.exp,
            sub: decoded.sub,
            tokenType: 'Bearer',
          }
        } catch (error) {
          console.error('[NEXTAUTH] Error decoding access token:', error)
          return { ...token, accessToken: account.access_token }
        }
      }

      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string

      if (token.sub && !session.user) {
        session.user = {
          id: token.sub as string,
          name: (token.name as string) || (token.sub as string),
          email: token.email as string,
          emailVerified: null,
          image: null,
        }
      }

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
    console.log('[NEXTAUTH] validateAuthToken: No accessToken in session')
    return false
  }

  try {
    const decoded = jwtDecode(session.accessToken)

    if (typeof decoded.exp !== 'number') {
      console.warn('[NEXTAUTH] validateAuthToken: Token missing expiration')
      return false
    }

    const expirationTime = decoded.exp * 1000

    const now = Date.now()
    return expirationTime >= now
  } catch (error) {
    console.error('[NEXTAUTH] Error validating token:', error)
    return false
  }
}
