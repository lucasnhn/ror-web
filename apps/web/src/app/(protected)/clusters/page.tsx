import { ClusterCard, ClusterCardDisplayData } from '@/components/ui/cluster/cluster-card'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { CodeSnippet } from '@ror/react/components/code-snippet'
import type { Metadata } from 'next'
import { ClustersTable } from './cluster-table'
import { ClusterPageViewSwitch } from './view-switch'
import { Header } from '@/components/layout/app-shell/header'
import { Toggle } from '@/components/shadcn/toggle'
import { Funnel } from 'lucide-react'

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

  // Set up pagination state for the table
  const paginationState = {
    pageIndex: page - 1, // Convert to 0-based for internal use
    pageSize: limit,
  }

  const pageCount = Math.ceil(clustersResponse.totalCount / limit)

  const displayData: ClusterCardDisplayData[] = [
    'argocd',
    'grafana',
    'rorcli',
    'kubectl',
    'accessGroups',
    'cpu',
    'memory',
    'nodes',
    'monthlyPrice',
    'yearlyPrice',
    'agentVersion',
    'kubernetesVersion',
    'toolingVersion',
    'datacenterName',
    'datacenterProvider',
    'environment',
  ]

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />

      <div className='w-full border-b h-28 flex items-center'>
        <div className='px-12 w-96'>
          <div>
            <Toggle variant={'outline'} aria-label='Open filters'>
              <Funnel />
            </Toggle>
          </div>
          <ClusterPageViewSwitch />
        </div>
      </div>

      <section className='px-12 my-8'>
        {params.view === 'list' ? (
          <ClustersTable
            key='table'
            data={clusters}
            pagination={paginationState}
            totalCount={clustersResponse.totalCount}
            pageCount={pageCount}
          />
        ) : (
          <div className='flex flex-wrap gap-6'>
            {clusters.map((cluster) => (
              <ClusterCard cluster={cluster} key={cluster.clusterId} displayData={displayData} />
            ))}
          </div>
        )}
      </section>

      {params.view === 'list' && (
        <div className='mt-8 px-6'>
          <details>
            <summary>Pagination</summary>
            <CodeSnippet type='multi' hideCopyButton>
              {JSON.stringify(paginationState, null, 2)}
            </CodeSnippet>
          </details>
        </div>
      )}
    </div>
  )
}
