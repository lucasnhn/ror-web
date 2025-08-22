'use server'

import { getRorApi } from '@/services/ror-api'
import type { KubernetesCluster } from '@ror/js-api-client'

type LoadMoreOpts = { skip: number; limit: number; sort?: string; order?: string }

export async function loadMoreClusters({ skip, limit, sort, order }: LoadMoreOpts) {
  console.log('[CLUSTER-ACTIONS] Loading more clusters:', { skip, limit, sort, order })
  const api = await getRorApi()

  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('skip', String(skip))
  if (sort) params.set('sort', sort)
  if (order) params.set('order', order)

  const res = await api.kubernetesClusters.list(params)
  const items: KubernetesCluster[] = res?.resources ?? []
  return {
    items,
    hasMore: items.length === limit,
    nextSkip: items.length === limit ? skip + limit : null,
  }
}
