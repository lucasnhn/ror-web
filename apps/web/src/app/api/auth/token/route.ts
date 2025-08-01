import { auth } from '@/config/next-auth'

export async function GET() {
  const session = await auth()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = session.accessToken

  if (!token) {
    return new Response('No access token in session', { status: 400 })
  }

  return Response.json({ accessToken: token })
}
