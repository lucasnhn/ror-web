import type { Metadata } from 'next'
import { Breadcrumb, BreadcrumbItem } from '@ror/react/components/breadcrumb'
import { CodeSnippet } from '@ror/react/components/code-snippet'
import { rorApiClient } from '@/services/ror-api'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { ClustersTable } from './cluster-table'
import { Fragment } from 'react'
import { ClusterCards } from './cluster-cards'
import Link from 'next/link'
import { ClusterPageViewSwitch } from './view-switch'

export const metadata: Metadata = {
  title: 'ROR (Beta) - Clusters',
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

  return (
    <Fragment>
      <header className='px-6 pt-6 mb-8'>
        <Breadcrumb className='mb-6'>
          <BreadcrumbItem isCurrentPage asChild>
            <Link href='/'>Dashboard</Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1>Clusters</h1>
      </header>

      <div className='px-6 max-w-[20rem]'>
        <ClusterPageViewSwitch />
      </div>

      <section className='px-6 mt-8'>
        {params.view === 'list' ? (
          <ClustersTable
            key='table'
            data={clusters}
            pagination={paginationState}
            totalCount={clustersResponse.totalCount}
            pageCount={pageCount}
          />
        ) : (
          <ClusterCards key='grid' data={clusters} />
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

      {process.env.NODE_ENV === 'development' && (
        <div className='mt-8 px-6'>
          <details>
            <summary>raw data</summary>
            <CodeSnippet type='multi' hideCopyButton>
              {JSON.stringify(clustersResponse, null, 2)}
            </CodeSnippet>
          </details>
        </div>
      )}
    </Fragment>
  )
}
