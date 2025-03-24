import { env } from '@/config/env'

const rorBaseApiUrl = env.NEXT_PUBLIC_ROR_API_URL

export const getRorAPIPath = (path: string) => `${rorBaseApiUrl}${path}`
