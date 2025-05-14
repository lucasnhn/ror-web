import { ClusterCard, ClusterCardDisplayData } from '@/components/ui/cluster/cluster-card'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { CodeSnippet } from '@ror/react/components/code-snippet'
import type { Metadata } from 'next'
import { ClustersTable } from './cluster-table'
import { Header } from '@/components/layout/app-shell/header'
import { Toggle } from '@/components/shadcn/toggle'
import { ArrowDownNarrowWide, ArrowDownWideNarrow, Funnel } from 'lucide-react'
import { TabsViewSwitcher } from '@/components/ui/tabs-view-switcher'
import Link from 'next/link'
import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { Button } from '@/components/shadcn/button'
import { SortSelect } from '@/components/ui/sort-select'

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

  const filtersOpen = params.filters === 'open'
  // const toggleFiltersParam = filtersOpen ? undefined : 'open'

  const newParams = new URLSearchParams(
    params as string | string[][] | Record<string, string> | URLSearchParams | undefined
  )
  if (filtersOpen) {
    newParams.delete('filters')
  } else {
    newParams.set('filters', 'open')
  }

  const toggleUrl = `/clusters?${newParams.toString()}`

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
  const status: Option[] = [
    {
      value: 'good',
      label: 'Good',
    },
    {
      value: 'smelly',
      label: 'Smelly',
    },
    {
      value: 'bad',
      label: 'Bad',
    },
  ]

  const environments: Option[] = [
    {
      value: 'development',
      label: 'Development',
    },
    {
      value: 'dev',
      label: 'Dev',
    },
    {
      value: 'test',
      label: 'Test',
    },
    {
      value: 'staging',
      label: 'Staging',
    },
    {
      value: 'production',
      label: 'Production',
    },
    {
      value: 'prod',
      label: 'Prod',
    },
    {
      value: 'qa',
      label: 'QA',
    },
  ]

  // TODO: Fetch this from somewhere
  const datacenters: Option[] = [
    {
      value: 'trd1-tanzu',
      label: 'trd1 - tanzu',
    },
    {
      value: 'osl1-tanzu',
      label: 'osl1 - tanzu',
    },
    {
      value: 'trd1cl02-tanzu',
      label: 'trd1cl02 - tanzu',
    },
    {
      value: 'norwayeast-aks',
      label: 'norwayeast - aks',
    },
    {
      value: 'trd1-talos',
      label: 'trd1 - talos',
    },
  ]

  // TODO: Fetch this from somewhere
  const workspaces: Option[] = [
    {
      value: 'trd1-amk-prod',
      label: 'trd1-amk-prod',
    },
    {
      value: 'trd1cl02-shp-prod',
      label: 'trd1cl02-shp-prod',
    },
    {
      value: 'trd1cl02-dcn',
      label: 'trd1cl02-dcn',
    },
    {
      value: 't-nhn',
      label: 't-nhn',
    },
    {
      value: 'trd1-amk',
      label: 'trd1-amk',
    },
    {
      value: 'trd1-app',
      label: 'trd1-app',
    },
    {
      value: 'trd1-team-kjernejournal-portal',
      label: 'trd1-team-kjernejournal-portal',
    },
  ]

  // TODO: Fetch this from somewhere
  const toolingVersions: Option[] = [
    {
      value: 'null',
      label: 'null',
    },
    {
      value: '1-6-10',
      label: '1.6.10',
    },
    {
      value: '1-6-18',
      label: '1.6.18',
    },
    {
      value: '1-6-19',
      label: '1.6.19',
    },
    {
      value: '1-6-20',
      label: '1.6.20',
    },
    {
      value: '1-6-21',
      label: '1.6.21',
    },
    {
      value: 'missing',
      label: 'Missing',
    },
  ]

  // TODO: Fetch this from somewhere
  const kubernetesVersions: Option[] = [
    {
      value: 'v1-26-13',
      label: 'v1.26.13',
    },
    {
      value: 'v1-27-10',
      label: 'v1.27.10',
    },
    {
      value: 'v1-27-11',
      label: 'v1.27.11',
    },
    {
      value: 'v1-28-7',
      label: 'v1.28.7',
    },
    {
      value: 'v1-30-11',
      label: 'v1.30.11',
    },
    {
      value: 'v1-31-4',
      label: 'v1.31.4',
    },
    {
      value: 'v1-31-6',
      label: 'v1.31.6',
    },
    {
      value: 'v1-32-1',
      label: 'v1.32.1',
    },
    {
      value: 'v1-32-3',
      label: 'v1.32.3',
    },
  ]

  const multipleSelectorOptions = [
    {
      label: 'Status',
      placeholder: 'Set status',
      data: status,
    },
    {
      label: 'Environments',
      placeholder: 'Set environments',
      data: environments,
    },
    {
      label: 'Datacenters',
      placeholder: 'Set datacenters',
      data: datacenters,
    },
    {
      label: 'Workspaces',
      placeholder: 'Set workspaces',
      data: workspaces,
    },
    {
      label: 'Tooling versions',
      placeholder: 'Set tooling versions',
      data: toolingVersions,
    },
    {
      label: 'Kubernetes versions',
      placeholder: 'Set kubernetes versions',
      data: kubernetesVersions,
    },
  ]

  const sortingOptions = [
    {
      value: 'clusterName',
      label: 'Cluster name',
    },
    {
      value: 'accessGroups',
      label: 'Num of access groups',
    },
    {
      value: 'cpu',
      label: 'CPU usage',
    },
    {
      value: 'memory',
      label: 'Memory usage',
    },
    {
      value: 'nodes',
      label: 'Num of nodes',
    },
    {
      value: 'monthlyPrice',
      label: 'Price',
    },
    {
      value: 'agentVersion',
      label: 'ROR agent version',
    },
    {
      value: 'toolingVersion',
      label: 'NHN tooling version',
    },
    {
      value: 'datacenterName',
      label: 'Datacenter',
    },
    {
      value: 'datacenterProvider',
      label: 'Datacenter provider',
    },
  ]

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />

      <div className='w-full border-b h-28 p-12 flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            {/* TODO: Make the sorting based on the display data */}
            <SortSelect options={sortingOptions} currentSort={params.sort} />

            {params.sort &&
              (() => {
                const toggleOrderParams = new URLSearchParams(
                  params as string[][] | Record<string, string> | string | URLSearchParams
                )
                const currentOrder = toggleOrderParams.get('order') === 'desc' ? 'desc' : 'asc'
                const nextOrder = currentOrder === 'desc' ? 'asc' : 'desc'
                toggleOrderParams.set('order', nextOrder)

                const toggleOrderUrl = `/clusters?${toggleOrderParams.toString()}`

                return (
                  <Link href={toggleOrderUrl}>
                    <Button variant='outline' className='border-[var(--input)]'>
                      {currentOrder === 'desc' ? (
                        <span className='flex gap-1 items-center'>
                          <ArrowDownWideNarrow className='w-4 h-4' />
                          DESC
                        </span>
                      ) : (
                        <span className='flex gap-1 items-center'>
                          <ArrowDownNarrowWide className='w-4 h-4' />
                          ASC
                        </span>
                      )}
                    </Button>
                  </Link>
                )
              })()}

            {/* TODO: Add text that says that filters are applied if filters are applied */}
            <Link href={toggleUrl}>
              <Toggle pressed={filtersOpen} variant='outline' aria-label='Open filters'>
                <Funnel />
              </Toggle>
            </Link>
            {filtersOpen && (
              <>
                {multipleSelectorOptions.map((option) => (
                  <MultipleSelector
                    key={option.label}
                    className='w-52'
                    commandProps={{
                      label: option.label,
                    }}
                    value={[]}
                    defaultOptions={option.data}
                    placeholder={option.placeholder}
                    hideClearAllButton
                    hidePlaceholderWhenSelected
                    emptyIndicator={<p className='text-center text-sm'>No results found</p>}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <TabsViewSwitcher />
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
