import { env } from '@/config/env'
import { createApiClient } from '@ror/js-api-client'

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
