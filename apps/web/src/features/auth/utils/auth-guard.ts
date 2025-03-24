import { redirect } from 'next/navigation'
import { auth } from '@/config/next-auth'

/**
 * Check if the user is authenticated
 * If the user is not authenticated, redirect to the sign-in page
 * otherwise, return the session
 */
export async function authGuard() {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }
  return session
}
