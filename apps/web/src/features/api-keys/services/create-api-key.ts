'use server'

import { getRorApi } from '@/services/ror-api'

export async function createApiKey({ name, ttl }: { name: string; ttl: number }) {
  const api = await getRorApi()
  const res = await api.apiKey.create({ name, ttl })
  return res
}
