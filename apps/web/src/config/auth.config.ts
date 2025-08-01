import { Session, type NextAuthConfig } from 'next-auth'
import { Provider } from 'next-auth/providers'
import { jwtDecode } from 'jwt-decode'
import { env } from '@/config/env'
import { routes } from './routes'

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
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
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
      }
      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user = {
        id: token.sub as string,
        name: token.name as string,
        email: token.email as string,
        image: null,
        emailVerified: null,
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
    console.log('[AUTH CONFIG] validateAuthToken: No accessToken in session')
    return false
  }

  try {
    const decoded = jwtDecode(session.accessToken)

    if (typeof decoded.exp !== 'number') {
      console.warn('[AUTH CONFIG] validateAuthToken: Token missing expiration')
      return false
    }

    const expirationTime = decoded.exp * 1000

    const now = Date.now()
    return expirationTime >= now
  } catch (error) {
    console.error('[AUTH CONFIG] Error validating token:', error)
    return false
  }
}
