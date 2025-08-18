// import { authConfig } from '@/config/auth.config'
// import NextAuth from 'next-auth'

// export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)

import NextAuth from 'next-auth'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth.config'
// import { authOptions } from '@/config/auth.config'

/** Use this in the route handler */
export const nextAuthHandler = NextAuth(authOptions)

/** Use this on the server to read the session */
export const auth = () => getServerSession(authOptions)
