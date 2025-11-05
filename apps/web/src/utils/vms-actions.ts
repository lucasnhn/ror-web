'use server'

import { getRorApi } from '@/services/ror-api'
import type { VirtualMachine } from '@ror/js-api-client'

type LoadMoreOpts = { offset: number; limit: number; sort?: string; order?: 'asc' | 'desc' }

export async function loadMoreVMs({ offset, limit, sort, order }: LoadMoreOpts) {
  const api = await getRorApi()

  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  if (sort) params.set('sort', sort)
  if (order) params.set('order', order)

  const res = await api.virtualMachine.list(params)
  const items: VirtualMachine[] = res?.resources ?? []
  return {
    items,
    hasMore: items.length === limit,
    nextOffset: items.length === limit ? offset + limit : null,
  }
}
