import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'

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

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1

export const dynamic = 'force-dynamic'

export default async function ClustersPage({ searchParams }: ClusterPageProps) {
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const params = await searchParams

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

  const clustersResponse = await client.kubernetesClusters.filter(requestOptions)
  const clusters = clustersResponse.data ?? []

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />
      <PageView clusters={clusters} params={params} />
    </div>
  )
}
