import { authGuard } from '@/features/auth/utils/auth-guard'
import { getRorApi } from '@/services/ror-api'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'
import type { Cluster, KubernetesCluster } from '@ror/js-api-client'

export const metadata: Metadata = {
  title: 'ROR - Clusters',
  description: 'View clusters',
}

interface ClusterPageProps {
  searchParams: Promise<{
    view?: 'grid' | 'list'
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
    filters?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ClustersPage({ searchParams }: ClusterPageProps) {
  const session = await authGuard()
  const user = session.user
  const api = await getRorApi()

  // Build URL parameters for the list method
  const params = await searchParams
  const listParams = new URLSearchParams()

  const DEFAULT_LIMIT = 10
  const DEFAULT_PAGE = 1

  // Parse pagination parameters from URL
  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE // URL shows 1-based indexing
  const skip = (page - 1) * limit

  // Parse sorting parameters from URL
  const sort = params.sort ? params.sort : 'clusterName'
  const order = params.order === 'asc' ? 1 : -1

  const sortOptions = {
    sortField: sort,
    sortOrder: order,
  }

  const requestOptions = {
    limit,
    skip,
    sort: params.sort ? [sortOptions] : [],
  }

  // If needed, add pagination and sorting params to the list request
  if (params.limit) listParams.set('limit', params.limit.toString())
  if (params.page) listParams.set('page', params.page.toString())
  if (params.sort) listParams.set('sort', params.sort)
  if (params.order) listParams.set('order', params.order)
  const response = await api.kubernetesClusters.list(listParams)
  const v1response = await api.kubernetesClusters.filter(requestOptions)

  const clusters: KubernetesCluster[] = response?.resources ?? []
  const v1clusters: Cluster[] = v1response?.data ?? []

  console.log('[CLUSTERS PAGE] V2 clusters')
  console.dir(clusters, { depth: null })
  console.log('[CLUSTERS PAGE] V1 clusters')
  console.dir(v1clusters, { depth: null })

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />
      <PageView user={user} clusters={clusters} params={params} />
    </div>
  )
}
