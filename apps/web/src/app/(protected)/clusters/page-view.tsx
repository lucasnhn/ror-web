'use client'

import { ClusterCard, ClusterCardDisplayData } from '@/components/ui/cluster/cluster-card'
import { SortSelect } from '@/components/ui/sort-select'
import { TabsViewSwitcher } from '@/components/ui/tabs-view-switcher'
import { ClustersTable } from './cluster-table'
import { CodeSnippet } from '@ror/react'
import { Toggle } from '@/components/shadcn/toggle'
import { Button } from '@/components/shadcn/button'
import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { ArrowDownNarrowWide, ArrowDownWideNarrow, Funnel } from 'lucide-react'
import { cn } from '@/utils/clsxm'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { KubernetesCluster } from '@ror/js-api-client'
import { ClusterSearch } from '@/components/ui/cluster/cluster-search'

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
  clusters: KubernetesCluster[]
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

const filterOptions = [
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
  const DEFAULT_LIMIT = 10
  const DEFAULT_PAGE = 1

  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE
  const filtersOpen = params.filters === 'open'

  const [selectedDisplayData, setSelectedDisplayData] = useState<ClusterCardDisplayData[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('selectedDisplayData')
    setSelectedDisplayData(stored ? JSON.parse(stored) : [])
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedDisplayData', JSON.stringify(selectedDisplayData))
  }, [selectedDisplayData])

  const paginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  }

  const pageCount = Math.ceil(clusters.length / limit)

  const toggleParams = useMemo(() => {
    const newParams = new URLSearchParams(params as string[][] | Record<string, string> | string | URLSearchParams)
    if (filtersOpen) {
      newParams.delete('filters')
    } else {
      newParams.set('filters', 'open')
    }
    return `/clusters?${newParams.toString()}`
  }, [params, filtersOpen])

  const toggleSortParams = useMemo(() => {
    if (!params.sort) return null
    const newParams = new URLSearchParams(params as string[][] | Record<string, string> | string | URLSearchParams)
    const currentOrder = newParams.get('order') === 'desc' ? 'desc' : 'asc'
    newParams.set('order', currentOrder === 'desc' ? 'asc' : 'desc')
    return {
      url: `/clusters?${newParams.toString()}`,
      isDesc: currentOrder === 'desc',
    }
  }, [params])

  const [searchResults, setSearchResults] = useState<KubernetesCluster[]>(clusters)

  const renderControls = () => (
    <div className='flex flex-wrap items-center justify-between w-full gap-4 [@container(max-width:1000px)]:flex-col [@container(max-width:1000px)]:items-start [@container(max-width:1000px)]:gap-6 '>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-6'>
        <ClusterSearch items={clusters} onResultsChange={(res) => setSearchResults(res)} />

        <MultipleSelector
          className='w-52'
          commandProps={{ label: 'Display data' }}
          value={displayDataOptions.filter((opt) => selectedDisplayData?.includes(opt.value as ClusterCardDisplayData))}
          onChange={(selected) => setSelectedDisplayData(selected.map((item) => item.value as ClusterCardDisplayData))}
          defaultOptions={displayDataOptions}
          placeholder='Set display data'
          hideClearAllButton
          hidePlaceholderWhenSelected
          emptyIndicator={<p className='text-center text-sm'>No results found</p>}
        />

        <SortSelect options={sortingOptions} currentSort={params.sort} />

        {toggleSortParams && (
          <Link href={toggleSortParams.url}>
            <Button variant='outline' className='border-[var(--input)]'>
              {toggleSortParams.isDesc ? (
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
        )}

        <Link className='[@container(max-width:1000px)]:hidden' href={toggleParams}>
          <Toggle pressed={filtersOpen} variant='outline' aria-label='Open filters'>
            <Funnel />
          </Toggle>
        </Link>
      </div>

      <div className='flex flex-row gap-4'>
        <Link className='[@container(min-width:1001px)]:hidden' href={toggleParams}>
          <Toggle pressed={filtersOpen} variant='outline' aria-label='Open filters'>
            <Funnel />
          </Toggle>
        </Link>
        <TabsViewSwitcher />
      </div>
    </div>
  )

  const renderFilterSection = () => {
    return (
      filtersOpen && (
        <div className='flex flex-wrap items-center gap-x-4 gap-y-6 min-h-28 mx-12 mt-6'>
          {filterOptions.map((option) => (
            <MultipleSelector
              key={option.label}
              className='w-52'
              commandProps={{ label: option.label }}
              value={[]}
              defaultOptions={option.data}
              placeholder={option.placeholder}
              hideClearAllButton
              hidePlaceholderWhenSelected
              emptyIndicator={<p className='text-center text-sm '>No results found</p>}
            />
          ))}
        </div>
      )
    )
  }

  return (
    <div className={cn(className, '@container')}>
      <div className={cn('border-b', filtersOpen && 'pb-2')}>
        <div className={cn('mx-12 flex items-center min-h-28 py-6 ', filtersOpen && 'w-[calc(100%-6rem)] border-b')}>
          {renderControls()}
        </div>
        {renderFilterSection()}
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
            {(searchResults ?? clusters).length > 0 ? (
              (searchResults ?? clusters).map((cluster) => (
                <ClusterCard
                  key={cluster.kubernetescluster?.spec.clusterId}
                  cluster={cluster}
                  displayData={
                    selectedDisplayData.length > 0
                      ? selectedDisplayData
                      : displayDataOptions.map((o) => o.value as ClusterCardDisplayData)
                  }
                />
              ))
            ) : (
              <p className='text-muted-foreground'>No cluster with a similar name exists.</p>
            )}
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
