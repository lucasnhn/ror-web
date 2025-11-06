'use server'

import { getRorApi } from '@/services/ror-api'
import type { VirtualMachine } from '@ror/js-api-client'

type LoadMoreOpts = { offset: number; limit: number; sort?: string; order?: 'asc' | 'desc' }

export async function loadMoreVMs({ offset, limit, sort, order }: LoadMoreOpts) {
  console.log(`[loadMoreVMs] ===== API CALL START =====`)
  console.log(`[loadMoreVMs] Parameters: offset=${offset}, limit=${limit}, sort=${sort}, order=${order}`)

  try {
    const api = await getRorApi()
    console.log(`[loadMoreVMs] API instance obtained`)

    const params = new URLSearchParams()
    params.set('limit', String(limit))
    params.set('offset', String(offset))
    if (sort) params.set('sort', sort)
    if (order) params.set('order', order)

    console.log(`[loadMoreVMs] URL params: ${params.toString()}`)
    console.log(`[loadMoreVMs] Making API call...`)

    const res = await api.virtualMachine.list(params)
    const items: VirtualMachine[] = res?.resources ?? []

    console.log(`[loadMoreVMs] ===== API RESPONSE =====`)
    console.log(`[loadMoreVMs] Total items received: ${items.length}`)
    console.log(`[loadMoreVMs] Expected limit: ${limit}`)
    console.log(`[loadMoreVMs] First item ID: ${items[0]?.metadata?.uid?.slice(0, 8) || 'N/A'}`)
    console.log(`[loadMoreVMs] Last item ID: ${items[items.length - 1]?.metadata?.uid?.slice(0, 8) || 'N/A'}`)
    console.log(
      `[loadMoreVMs] Sample item names:`,
      items.slice(0, 3).map((vm) => vm.metadata?.name || 'unnamed')
    )
    console.log(`[loadMoreVMs] hasMore will be: ${items.length === limit}`)
    console.log(`[loadMoreVMs] ===== API CALL END =====`)

    return {
      items,
      hasMore: items.length === limit,
      nextOffset: items.length === limit ? offset + limit : null,
    }
  } catch (error) {
    console.error(`[loadMoreVMs] ===== API ERROR =====`)
    console.error(`[loadMoreVMs] Error details:`, error)
    console.error(`[loadMoreVMs] ===== ERROR END =====`)
    return {
      items: [],
      hasMore: false,
      nextOffset: null,
    }
  }
}
