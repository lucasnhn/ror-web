import { authConfig } from '@/config/auth.config'
import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
