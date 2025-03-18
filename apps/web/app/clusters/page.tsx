import type { Metadata } from 'next'
import { Breadcrumb, BreadcrumbItem } from '@ror/react/components/breadcrumb'
import { CodeSnippet } from '@ror/react/components/code-snippet'
import { rorApiClient } from '@/services/ror-api'
import { authGuard } from '../auth-guard'
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
  }>
}

export default async function ClustersPage({ searchParams }: ClusterPageProps) {
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const clustersResponse = await client.clusters.filter()
  const params = await searchParams

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
          <ClustersTable key='table' data={clustersResponse.data} />
        ) : (
          <ClusterCards key='grid' data={clustersResponse.data} />
        )}
      </section>

      <div className='mt-8 px-6'>
        <details>
          <summary>raw data</summary>
          <CodeSnippet type='multi' hideCopyButton>
            {JSON.stringify(clustersResponse, null, 2)}
          </CodeSnippet>
        </details>
      </div>
    </Fragment>
  )
}
