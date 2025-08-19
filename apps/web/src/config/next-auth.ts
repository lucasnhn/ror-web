import NextAuth from 'next-auth'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth.config'

/** Use this in the route handler */
export const nextAuthHandler = NextAuth(authOptions)

/** Use this on the server to read the session */
export const auth = () => getServerSession(authOptions)
