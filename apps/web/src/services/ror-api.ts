import { env } from '@/config/env'
import { auth } from '@/config/next-auth'
import { createApiClient } from '@ror/js-api-client'

/**
 * Lightweight HTTP error class so callers can distinguish
 * auth/permission problems (e.g., 401/403) from other errors.
 */
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
 * Follows factory pattern.
 *
 * @param accessToken - The access token to be used for authentication with the ROR API.
 * @returns An instance of the ROR API client configured with the provided access token.
 */
export const rorApiClient = (accessToken: string) => {
  const config = {
    baseUrl: env.NEXT_PUBLIC_ROR_API_URL, // public base URL for the ROR API (must be set in env)
    accessToken, // bearer token attached by client for each request
  }
  return createApiClient(config)
}

/**
 * Convenience helper for server-side use:
 * - Reads the current NextAuth session.
 * - Ensures an access token is present.
 * - Returns a ready-to-use ROR API client.
 *
 * Throws:
 * - HttpError(401) if the user is unauthenticated or token missing.
 */
export async function getRorApi() {
  const session = await auth()
  if (!session?.accessToken) {
    throw new HttpError(401, 'Missing access token')
  }
  return rorApiClient(session.accessToken)
}

/**
 * Helper type: resolves to the concrete API client type returned by getRorApi().
 * Useful for typing variables/functions that depend on the client.
 */
export type RorApi = Awaited<ReturnType<typeof getRorApi>>
