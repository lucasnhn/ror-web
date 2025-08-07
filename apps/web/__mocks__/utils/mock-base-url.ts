import { env } from '@/config/env'

const rorBaseApiUrl = env.NEXT_PUBLIC_ROR_API_URL

/**
 * Is not used, because it is only used in file used for v1 clusters, but will keep for reference
 * Get the full ROR API path for a given endpoint.
 * @param path The API endpoint path (e.g., '/v1/clusters')
 * @returns The full ROR API URL for the specified endpoint.
 */
export const getRorAPIPath = (path: string) => `${rorBaseApiUrl}${path}`
