'use server'

import { getRorApi } from '@/services/ror-api'

export async function deleteApiKey({ apikeyId }: { apikeyId: string }) {
  const api = await getRorApi()
  const res = await api.apiKey.delete({ apikeyId })
  return res
}
