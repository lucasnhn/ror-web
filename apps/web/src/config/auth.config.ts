// // import { Session, type NextAuthConfig } from 'next-auth'
// // import { Provider } from 'next-auth/providers'
// // import { jwtDecode } from 'jwt-decode'
// // import { env } from '@/config/env'
// // import { routes } from './routes'
// // import type { JWT } from 'next-auth/jwt'

// // const dexIdpProvider: Provider = {
// //   type: 'oidc',
// //   id: 'dex',
// //   name: 'dex',
// //   issuer: env.AUTH_ISSUER,
// //   clientId: env.AUTH_CLIENT_ID,
// //   clientSecret: env.AUTH_CLIENT_SECRET,
// //   authorization: {
// //     params: {
// //       scope: 'openid profile email groups offline_access', // Added offline_access
// //       response_type: 'code',
// //     },
// //   },
// //   checks: ['pkce', 'state'],
// //   client: {
// //     token_endpoint_auth_method: 'client_secret_basic',
// //   },
// //   profile(profile) {
// //     console.log('[AUTH CONFIG] Profile received from Dex:', profile)
// //     return {
// //       id: profile.sub,
// //       name: profile.name || profile.preferred_username || profile.sub,
// //       email: profile.email,
// //       image: profile.picture,
// //       emailVerified: null,
// //     }
// //   },
// // }

// // declare module 'next-auth/jwt' {
// //   interface JWT {
// //     accessToken?: string
// //     refreshToken?: string
// //     accessTokenExpires?: number // epoch millis
// //     error?: 'RefreshAccessTokenError'
// //   }
// // }

// // const trusthost = Boolean(JSON.parse(env.AUTH_TRUST_HOST))

// // declare module 'next-auth' {
// //   interface Session {
// //     user: {
// //       id: string
// //       name?: string | null
// //       email?: string | null
// //       image?: string | null
// //     }
// //     accessToken: string
// //     error?: 'RefreshAccessTokenError' // added this
// //   }

// //   interface User {
// //     id: string
// //     email?: string | null
// //     name?: string | null
// //     image?: string | null
// //   }
// // }

// // // Add helper function to refresh token
// // async function refreshAccessToken(token: JWT): Promise<JWT> {
// //   try {
// //     if (!token.refreshToken) {
// //       return { ...token, error: 'RefreshAccessTokenError' as const }
// //     }

// //     const body = new URLSearchParams({
// //       grant_type: 'refresh_token',
// //       refresh_token: token.refreshToken,
// //       client_id: env.AUTH_CLIENT_ID,
// //       client_secret: env.AUTH_CLIENT_SECRET,
// //     })

// //     const res = await fetch(`${env.AUTH_ISSUER}/token`, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// //       body: body.toString(),
// //       cache: 'no-store',
// //     })

// //     if (!res.ok) {
// //       const text = await res.text().catch(() => '')
// //       console.error('[AUTH CONFIG] refreshAccessToken failed:', res.status, text)
// //       return { ...token, error: 'RefreshAccessTokenError' as const }
// //     }

// //     const refreshed = await res.json()
// //     const nextAccess = refreshed.access_token ?? token.accessToken
// //     const nextRefresh = refreshed.refresh_token ?? token.refreshToken
// //     const expiresInSec: number | undefined = typeof refreshed.expires_in === 'number' ? refreshed.expires_in : undefined

// //     // Find expiry in ms
// //     const nextExpires =
// //       typeof expiresInSec === 'number'
// //         ? Date.now() + expiresInSec * 1000
// //         : (() => {
// //             try {
// //               const decoded = jwtDecode<{ exp?: number }>(nextAccess!)
// //               return decoded?.exp ? decoded.exp * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days if no exp
// //             } catch {
// //               return Date.now() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days if decoding fails
// //             }
// //           })()

// //     return {
// //       ...token,
// //       accessToken: nextAccess,
// //       refreshToken: nextRefresh,
// //       accessTokenExpires: nextExpires,
// //       error: undefined,
// //     }
// //   } catch (error) {
// //     console.error('[AUTH CONFIG] refreshAccessToken exception:', error)
// //     return { ...token, error: 'RefreshAccessTokenError' as const }
// //   }
// // }

// // export const authConfig: NextAuthConfig = {
// //   providers: [dexIdpProvider],
// //   // trustHost: trusthost,
// //   secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
// //   debug: process.env.NODE_ENV !== 'production',

// //   session: {
// //     strategy: 'jwt',
// //     maxAge: 30 * 24 * 60 * 60, // 30 days
// //   },

// //   // cookies: {
// //   //   callbackUrl: {
// //   //     name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
// //   //     options: {
// //   //       sameSite: 'lax',
// //   //       path: '/',
// //   //       secure: process.env.NODE_ENV === 'production',
// //   //     },
// //   //   },
// //   //   csrfToken: {
// //   //     name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
// //   //     options: {
// //   //       httpOnly: true,
// //   //       sameSite: 'lax',
// //   //       path: '/',
// //   //       secure: process.env.NODE_ENV === 'production',
// //   //     },
// //   //   },
// //   // },

// //   pages: {
// //     signIn: routes.auth.signIn.getHref(),
// //     error: '/auth-debug',
// //   },

// //   callbacks: {
// //     async jwt({ token, account }) {
// //       if (account?.access_token) {
// //         token.accessToken = account.access_token as string
// //         token.refreshToken = account.refresh_token as string | undefined // added this
// //         // added this
// //         const expMs =
// //           typeof account.expires_at === 'number'
// //             ? account.expires_at * 1000
// //             : typeof expires_in === 'number'
// //               ? Date.now() + (account as any).expires_in * 1000
// //               : (() => {
// //                   try {
// //                     const decoded = jwtDecode<{ exp?: number }>(account.access_token!)
// //                     return decoded?.exp ? decoded.exp * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000
// //                   } catch {
// //                     return Date.now() + 30 * 24 * 60 * 60 * 1000
// //                   }
// //                 })()
// //         token.accessTokenExpires = expMs // added this
// //         return token // moved this inside if
// //       }

// //       // added this
// //       if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
// //         return token
// //       }

// //       // added this
// //       return await refreshAccessToken(token)
// //     },

// //     async session({ session, token }) {
// //       session.accessToken = token.accessToken as string
// //       session.user = {
// //         id: (token.sub as string) ?? '', // changed this
// //         name: (token.name as string) ?? null, // changed this
// //         email: (token.email as string) ?? null, // changed this
// //         image: null,
// //         emailVerified: null,
// //       }
// //       if (token.error) session.error = token.error // added this
// //       return session
// //     },

// //     async authorized({ request, auth }) {
// //       if (request.method === 'POST') {
// //         return validateAuthToken(auth)
// //       }

// //       return !!auth?.user
// //     },
// //   },
// // }

// // function validateAuthToken(session: Session | null): boolean {
// //   if (!session?.accessToken) {
// //     console.log('[AUTH CONFIG] validateAuthToken: No accessToken in session')
// //     return false
// //   }

// //   try {
// //     const decoded = jwtDecode<{ exp?: number }>(session.accessToken) // changed this

// //     if (typeof decoded.exp !== 'number') {
// //       console.warn('[AUTH CONFIG] validateAuthToken: Token missing expiration')
// //       return false
// //     }

// //     // const expirationTime = decoded.exp * 1000

// //     // const now = Date.now()
// //     // return expirationTime >= now

// //     // changed the return over to this
// //     return decoded.exp * 1000 >= Date.now()
// //   } catch (error) {
// //     console.error('[AUTH CONFIG] Error validating token:', error)
// //     return false
// //   }
// // }

// import { type Session, type NextAuthConfig } from 'next-auth'
// import { Provider } from 'next-auth/providers'
// import type { JWT } from 'next-auth/jwt'
// import { jwtDecode } from 'jwt-decode'
// import { env } from '@/config/env'
// import { routes } from './routes'

// /** OIDC (Dex) provider */
// const dexIdpProvider: Provider = {
//   type: 'oidc',
//   id: 'dex',
//   name: 'dex',
//   issuer: env.AUTH_ISSUER,
//   clientId: env.AUTH_CLIENT_ID,
//   clientSecret: env.AUTH_CLIENT_SECRET,
//   authorization: {
//     params: {
//       scope: 'openid profile email groups offline_access',
//       response_type: 'code',
//     },
//   },
//   checks: ['pkce', 'state'],
//   client: {
//     token_endpoint_auth_method: 'client_secret_basic',
//   },
//   profile(profile) {
//     // Optional: helpful during setup
//     console.log('[AUTH CONFIG] Profile from Dex:', profile)
//     return {
//       id: profile.sub,
//       name: profile.name || profile.preferred_username || profile.sub,
//       email: profile.email,
//       image: profile.picture,
//       emailVerified: null,
//     }
//   },
// }

// /** Module augmentations */
// declare module 'next-auth/jwt' {
//   interface JWT {
//     accessToken?: string
//     refreshToken?: string
//     /** epoch millis */
//     accessTokenExpires?: number
//     error?: 'RefreshAccessTokenError'
//   }
// }

// const trusthost = Boolean(JSON.parse(env.AUTH_TRUST_HOST))

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string
//       name?: string | null
//       email?: string | null
//       image?: string | null
//       emailVerified?: Date | null
//     }
//     accessToken: string
//     error?: 'RefreshAccessTokenError'
//   }

//   interface User {
//     id: string
//     email?: string | null
//     name?: string | null
//     image?: string | null
//     emailVerified?: Date | null
//   }
// }

// /** Small helper type to avoid any */
// type AccountExpiry = { expires_at?: number; expires_in?: number }
// type AccountLike = { access_token?: string; refresh_token?: string } & AccountExpiry

// /** Compute access token expiry in ms, from account or by decoding the token. */
// function computeAccessTokenExpiry(account?: AccountExpiry, accessToken?: string): number {
//   if (account?.expires_at && typeof account.expires_at === 'number') {
//     return account.expires_at * 1000
//   }
//   if (account?.expires_in && typeof account.expires_in === 'number') {
//     return Date.now() + account.expires_in * 1000
//   }
//   if (accessToken) {
//     try {
//       const decoded = jwtDecode<{ exp?: number }>(accessToken)
//       if (typeof decoded.exp === 'number') return decoded.exp * 1000
//     } catch {
//       /* ignore */
//     }
//   }
//   // Conservative fallback if the IdP does not give exp at all.
//   return Date.now() + 60 * 60 * 1000 // 1h
// }

// /** Refresh flow for the access token */
// async function refreshAccessToken(token: JWT): Promise<JWT> {
//   try {
//     if (!token.refreshToken) {
//       return { ...token, error: 'RefreshAccessTokenError' as const }
//     }

//     const body = new URLSearchParams({
//       grant_type: 'refresh_token',
//       refresh_token: token.refreshToken,
//       client_id: env.AUTH_CLIENT_ID,
//       client_secret: env.AUTH_CLIENT_SECRET,
//     })

//     const res = await fetch(`${env.AUTH_ISSUER}/token`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: body.toString(),
//       cache: 'no-store',
//     })

//     if (!res.ok) {
//       const text = await res.text().catch(() => '')
//       console.error('[AUTH CONFIG] refreshAccessToken failed:', res.status, text)
//       return { ...token, error: 'RefreshAccessTokenError' as const }
//     }

//     const data: { access_token?: string; refresh_token?: string; expires_in?: number } = await res.json()

//     const nextAccess = data.access_token ?? token.accessToken
//     const nextRefresh = data.refresh_token ?? token.refreshToken

//     const nextExpires =
//       typeof data.expires_in === 'number'
//         ? Date.now() + data.expires_in * 1000
//         : computeAccessTokenExpiry(undefined, nextAccess)

//     return {
//       ...token,
//       accessToken: nextAccess,
//       refreshToken: nextRefresh,
//       accessTokenExpires: nextExpires,
//       error: undefined,
//     }
//   } catch (error) {
//     console.error('[AUTH CONFIG] refreshAccessToken exception:', error)
//     return { ...token, error: 'RefreshAccessTokenError' as const }
//   }
// }

// /** NextAuth config */
// export const authConfig: NextAuthConfig = {
//   providers: [dexIdpProvider],
//   trustHost: trusthost,
//   secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
//   debug: process.env.NODE_ENV !== 'production',

//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days (controls session JWT 'exp')
//   },

//   pages: {
//     signIn: routes.auth.signIn.getHref(),
//     error: '/auth-debug',
//   },

//   callbacks: {
//     async jwt({ token, account }) {
//       const acc = account as AccountLike | undefined

//       // Initial sign-in
//       if (acc?.access_token) {
//         token.accessToken = acc.access_token
//         token.refreshToken = acc.refresh_token
//         token.accessTokenExpires = computeAccessTokenExpiry(
//           { expires_at: acc.expires_at, expires_in: acc.expires_in },
//           token.accessToken
//         )
//         return token
//       }

//       // Backfill if somehow missing
//       if (!token.accessTokenExpires && token.accessToken) {
//         token.accessTokenExpires = computeAccessTokenExpiry(undefined, token.accessToken)
//       }

//       // Still valid -> pass through
//       if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
//         return token
//       }

//       // Refresh
//       return await refreshAccessToken(token)
//     },

//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string
//       session.user = {
//         id: (token.sub as string) ?? '',
//         name: (token.name as string) ?? null,
//         email: (token.email as string) ?? null,
//         image: null,
//         emailVerified: null,
//       }
//       if (token.error) session.error = token.error
//       return session
//     },

//     async authorized({ request, auth }) {
//       // For POSTs, require a valid (non-expired) API access token
//       if (request.method === 'POST') {
//         return validateAuthToken(auth)
//       }
//       // For GETs etc., a logged-in user is enough
//       return !!auth?.user
//     },
//   },
// }

// /** Validate the API access token on the session (not the session JWT) */
// function validateAuthToken(session: Session | null): boolean {
//   if (!session?.accessToken) {
//     console.log('[AUTH CONFIG] validateAuthToken: No accessToken in session')
//     return false
//   }
//   try {
//     const decoded = jwtDecode<{ exp?: number }>(session.accessToken)
//     if (typeof decoded.exp !== 'number') {
//       console.warn('[AUTH CONFIG] validateAuthToken: Token missing expiration')
//       return false
//     }
//     return decoded.exp * 1000 >= Date.now()
//   } catch (error) {
//     console.error('[AUTH CONFIG] Error validating token:', error)
//     return false
//   }
// }

import type { NextAuthOptions, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { OAuthConfig } from 'next-auth/providers/oauth'
import { jwtDecode } from 'jwt-decode'
import { env } from '@/config/env'
// routes import removed (no custom pages.signIn)

/* ========= Module augmentations ========= */
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    /** epoch millis */
    accessTokenExpires?: number
    error?: 'RefreshAccessTokenError'
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      emailVerified?: Date | null
    }
    accessToken: string
    error?: 'RefreshAccessTokenError'
  }
}

/* ========= Local types ========= */
type DexProfile = {
  sub: string
  name?: string
  preferred_username?: string
  email?: string
  picture?: string
} & Record<string, unknown>

type OAuthAccount = {
  access_token?: string
  refresh_token?: string
  /** seconds since epoch (absolute) */
  expires_at?: number
  /** seconds from now (relative) */
  expires_in?: number
}

/* ========= Helpers ========= */
function computeAccessTokenExpiry(
  account?: Pick<OAuthAccount, 'expires_at' | 'expires_in'>,
  accessToken?: string
): number {
  if (typeof account?.expires_at === 'number') return account.expires_at * 1000
  if (typeof account?.expires_in === 'number') return Date.now() + account.expires_in * 1000
  if (accessToken) {
    try {
      const decoded = jwtDecode<{ exp?: number }>(accessToken)
      if (typeof decoded.exp === 'number') return decoded.exp * 1000
    } catch {
      /* ignore */
    }
  }
  // Conservative fallback when IdP doesn’t provide expiry
  return Date.now() + 60 * 60 * 1000 // 1h
}

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
      console.error('[AUTH] refreshAccessToken failed:', res.status, text)
      return { ...token, error: 'RefreshAccessTokenError' as const }
    }

    const data: {
      access_token?: string
      refresh_token?: string
      expires_in?: number
    } = await res.json()

    const nextAccess = data.access_token ?? token.accessToken
    const nextRefresh = data.refresh_token ?? token.refreshToken
    const nextExpires =
      typeof data.expires_in === 'number'
        ? Date.now() + data.expires_in * 1000
        : computeAccessTokenExpiry(undefined, nextAccess)

    return {
      ...token,
      accessToken: nextAccess,
      refreshToken: nextRefresh,
      accessTokenExpires: nextExpires,
      error: undefined,
    }
  } catch (err) {
    console.error('[AUTH] refreshAccessToken exception:', err)
    return { ...token, error: 'RefreshAccessTokenError' as const }
  }
}

/* ========= Dex as generic OAuth/OIDC provider (wellKnown discovery) ========= */
const DexProvider: OAuthConfig<DexProfile> = {
  id: 'dex',
  name: 'dex',
  type: 'oauth',
  wellKnown: `${env.AUTH_ISSUER}/.well-known/openid-configuration`,
  clientId: env.AUTH_CLIENT_ID,
  clientSecret: env.AUTH_CLIENT_SECRET,
  authorization: {
    params: {
      scope: 'openid profile email groups offline_access',
      response_type: 'code',
    },
  },
  checks: ['pkce', 'state'],
  profile(profile) {
    console.log('[AUTH] Profile from Dex:', profile)
    return {
      id: profile.sub,
      name: profile.name || profile.preferred_username || profile.sub,
      email: profile.email,
      image: profile.picture,
      emailVerified: null,
    }
  },
}

/* ========= NextAuth options (v4) ========= */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // session JWT lifetime (not the API access token)
  },
  providers: [DexProvider],
  pages: {
    error: '/auth-debug',
  },
  callbacks: {
    async jwt({ token, account }) {
      const acc = account as OAuthAccount | undefined

      // Initial sign-in
      if (acc?.access_token) {
        token.accessToken = acc.access_token
        token.refreshToken = acc.refresh_token
        token.accessTokenExpires = computeAccessTokenExpiry(
          { expires_at: acc.expires_at, expires_in: acc.expires_in },
          acc.access_token
        )
        return token
      }

      // Ensure we have an expiry if missing
      if (!token.accessTokenExpires && token.accessToken) {
        token.accessTokenExpires = computeAccessTokenExpiry(undefined, token.accessToken)
      }

      // Still valid -> pass through
      if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // Otherwise refresh
      return refreshAccessToken(token)
    },

    async session({ session, token }) {
      session.accessToken = (token.accessToken as string) ?? ''
      session.user = {
        id: (token.sub as string) ?? '',
        name: (token.name as string) ?? null,
        email: (token.email as string) ?? null,
        image: null,
        emailVerified: null,
      }
      if (token.error) session.error = token.error
      return session
    },
  },
  events: {
    async signIn(message: {
      user: { id?: string } | null
      account: { provider?: string } | null
      isNewUser?: boolean
    }) {
      const dbg = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production'
      if (!dbg) return
      try {
        console.log('[AUTH][EVT] signIn', {
          provider: message?.account?.provider,
          userId: message?.user?.id,
          isNewUser: message?.isNewUser,
        })
      } catch {}
    },
    async session(message: { session?: Session & { accessToken?: string } }) {
      const dbg = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production'
      if (!dbg) return
      try {
        console.log('[AUTH][EVT] session', {
          userId: message?.session?.user?.id,
          hasAccessToken: Boolean(message?.session?.accessToken),
        })
      } catch {}
    },
  },
  logger: {
    error(code, metadata) {
      const dbg = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production'
      if (!dbg) return
      try {
        console.error('[AUTH][LOG] error', code, metadata)
      } catch {}
    },
    warn(code) {
      const dbg = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production'
      if (!dbg) return
      try {
        console.warn('[AUTH][LOG] warn', code)
      } catch {}
    },
    debug(code, metadata) {
      const dbg = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production'
      if (!dbg) return
      try {
        console.log('[AUTH][LOG] debug', code, metadata)
      } catch {}
    },
  },
}

/* ========= Optional helper used by middleware, etc. ========= */
export function validateAuthToken(session: Session | null): boolean {
  if (!session?.accessToken) return false
  try {
    const decoded = jwtDecode<{ exp?: number }>(session.accessToken)
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 >= Date.now() : false
  } catch {
    return false
  }
}
