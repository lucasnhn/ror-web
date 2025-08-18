import { authGuard } from '@/features/auth/utils/auth-guard'
// import { getRorApi, rorApiClient } from '@/services/ror-api'
import { getRorApi } from '@/services/ror-api'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'
import type { KubernetesCluster } from '@ror/js-api-client'

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
  // removed this: const client = rorApiClient(session.accessToken)
  const user = session.user
  const api = await getRorApi()

  // Build URL parameters for the list method
  const params = await searchParams
  const listParams = new URLSearchParams()

  // If needed, add pagination and sorting params to the list request
  if (params.limit) listParams.set('limit', params.limit.toString())
  if (params.page) listParams.set('page', params.page.toString())
  if (params.sort) listParams.set('sort', params.sort)
  if (params.order) listParams.set('order', params.order)
  const response = await api.kubernetesClusters.list(listParams)

  const clusters: KubernetesCluster[] = response?.resources ?? []

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />
      <PageView user={user} clusters={clusters} params={params} />
    </div>
  )
}
