'use client'

import { Button } from '@/components/shadcn/button'
import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { Toggle } from '@/components/shadcn/toggle'
import { ClusterSearch } from '@/components/ui/cluster-search'
import { SortSelect } from '@/components/ui/sort-select'
import { TabsViewSwitcher } from '@/components/ui/tabs-view-switcher'
import { cn } from '@/utils/clsxm'
import { Cluster } from '@ror/js-api-client'
import { ArrowDownWideNarrow, ArrowDownNarrowWide, Funnel } from 'lucide-react'
import Link from 'next/link'
import { CodeSnippet } from '@ror/react'
import { ClustersTable } from './cluster-table'
import { ClusterCard, ClusterCardDisplayData } from '@/components/ui/cluster/cluster-card'
import { useEffect, useState } from 'react'

interface Params {
  view?: 'grid' | 'list'
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: string
}

interface PageViewProps {
  className?: string
  clusters: Cluster[]
  params: Params
}

const displayDataOptions: Option[] = [
  {
    value: 'argocd',
    label: 'ArgoCD',
  },
  {
    value: 'grafana',
    label: 'Grafana',
  },
  {
    value: 'rorcli',
    label: 'ROR CLI',
  },
  {
    value: 'kubectl',
    label: 'Kubectl',
  },
  {
    value: 'accessGroups',
    label: 'Access groups',
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
    label: 'Monthly price',
  },
  {
    value: 'yearlyPrice',
    label: 'Yearly price',
  },
  {
    value: 'agentVersion',
    label: 'ROR agent version',
  },
  {
    value: 'kubernetesVersion',
    label: 'Kubernetes version',
  },
  {
    value: 'toolingVersion',
    label: 'NHN tooling version',
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

export const PageView = ({ className, clusters, params }: PageViewProps) => {
  const filtersOpen = params.filters === 'open'
  const newParams = new URLSearchParams(
    params as string | string[][] | Record<string, string> | URLSearchParams | undefined
  )

  if (filtersOpen) {
    newParams.delete('filters')
  } else {
    newParams.set('filters', 'open')
  }
  const toggleUrl = `/clusters?${newParams.toString()}`

  const DEFAULT_LIMIT = 10
  const DEFAULT_PAGE = 1

  // Parse pagination parameters from URL
  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE // URL shows 1-based indexing

  // Keep this for future pagination
  // const skip = (page - 1) * limit
  // Parse sorting parameters from URL
  // const sort = params.sort ? params.sort : 'clusterName'
  // const order = params.order === 'asc' ? 1 : -1

  // Set up pagination state for the table
  const paginationState = {
    pageIndex: page - 1, // Convert to 0-based for internal use
    pageSize: limit,
  }

  const pageCount = Math.ceil(clusters.length / limit)

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

  const [selectedDisplayData, setSelectedDisplayData] = useState<ClusterCardDisplayData[] | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('selectedDisplayData')
    setSelectedDisplayData(stored ? JSON.parse(stored) : [])
  }, [])

  useEffect(() => {
    if (selectedDisplayData !== null) {
      localStorage.setItem('selectedDisplayData', JSON.stringify(selectedDisplayData))
    }
  }, [selectedDisplayData])

  return (
    <div>
      <div className='w-full border-b h-28 p-12 flex items-center justify-between'>
        <div className={cn(className, 'flex items-center gap-2')}>
          {/* Search input */}
          <ClusterSearch items={clusters} />

          {/* Display data */}
          <MultipleSelector
            className='w-52'
            commandProps={{ label: 'Display data' }}
            value={displayDataOptions.filter(
              (opt) => selectedDisplayData?.includes(opt.value as ClusterCardDisplayData) ?? false
            )}
            onChange={(selected) => {
              setSelectedDisplayData(selected.map((item) => item.value as ClusterCardDisplayData))
            }}
            defaultOptions={displayDataOptions}
            placeholder='Set display data'
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className='text-center text-sm'>No results found</p>}
          />

          {/* Sorting */}
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

          {/* Filtering */}
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
        <TabsViewSwitcher />
      </div>
      <section className='px-12 my-8'>
        {params.view === 'list' ? (
          <ClustersTable
            key='table'
            data={clusters}
            pagination={paginationState}
            totalCount={clusters.length}
            pageCount={pageCount}
          />
        ) : (
          <div className='flex flex-wrap gap-6'>
            {clusters.map((cluster) => (
              <ClusterCard
                key={cluster.clusterId}
                cluster={cluster}
                displayData={selectedDisplayData && selectedDisplayData.length > 0 ? selectedDisplayData : displayData}
              />
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
