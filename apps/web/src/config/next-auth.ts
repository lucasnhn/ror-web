import NextAuth from 'next-auth'
import { Provider } from 'next-auth/providers'
import { jwtDecode } from 'jwt-decode'
import { env } from '@/config/env'

/**
 * We are adding the accessToken to the session so it can be retrieved from the
 * `auth()` function. Here we are simply augmenting the existing Session type to
 * include the accessToken.
 */
declare module 'next-auth' {
  interface Session {
    accessToken: string
  }
}

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
    },
  },
}

const trusthost = Boolean(JSON.parse(env.AUTH_TRUST_HOST))

/**
 * Setup NextAuth (otherwise also known as Auth.js)
 * Note that it exports:
 * - Handlers
 * - signIn function
 * - signOut function
 * - auth utility function
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [dexIdpProvider],
  trustHost: trusthost,
  callbacks: {
    jwt({ token, account }) {
      if (account?.provider === 'dex') {
        if (!account?.access_token) {
          throw new Error('Did not receive access_token from DexIdp on login callback')
        }
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    authorized: async ({ auth }) => {
      if (!auth?.accessToken) {
        return false
      }

      const decodedToken = jwtDecode(auth?.accessToken as string)

      if (!decodedToken) {
        return false
      }

      // Check if the authentication token from dex has expired
      const expirationTime = (decodedToken.exp as number) * 1000
      const currentTime = Date.now()
      const isTokenExpired = expirationTime < currentTime
      return isTokenExpired ? false : true
    },
  },
})
