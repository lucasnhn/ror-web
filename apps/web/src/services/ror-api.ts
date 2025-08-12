import { env } from '@/config/env'
import { auth } from '@/config/next-auth'
import { createApiClient } from '@ror/js-api-client'

class HttpError extends Error {
  status: number
  constructor(status: number, message?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/**
 * Creates an instance of the ROR API client. Use this to interact with the ROR API.
 *
 * @param accessToken - The access token to be used for authentication with the ROR API.
 * @returns An instance of the ROR API client configured with the provided access token.
 */
export const rorApiClient = (accessToken: string) => {
  const config = {
    baseUrl: env.NEXT_PUBLIC_ROR_API_URL,
    accessToken,
  }
  return createApiClient(config)
}

export async function getRorApi() {
  const session = await auth()
  if (!session?.accessToken) {
    throw new HttpError(401, 'Missing access token')
  }
  return rorApiClient(session.accessToken)
}

export type RorApi = Awaited<ReturnType<typeof getRorApi>>
