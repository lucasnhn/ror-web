import { env } from '@/config/env'
import { createApiClient } from '@ror/js-api-client'

export const rorApiClient = (accessToken: string) => {
  const config = {
    baseUrl: env.NEXT_PUBLIC_ROR_API_URL,
    accessToken,
  }
  return createApiClient(config)
}
