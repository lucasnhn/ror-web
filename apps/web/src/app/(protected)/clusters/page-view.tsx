'use client'

import { ClusterCard, ClusterCardDisplayData } from '@/components/ui/cluster/cluster-card'
import { SortSelect } from '@/components/ui/sort-select'
import { TabsViewSwitcher } from '@/components/ui/tabs-view-switcher'
import { ClustersTable } from './cluster-table'
import { CodeSnippet } from '@ror/react'
import { Toggle } from '@/components/shadcn/toggle'
import { Button } from '@/components/shadcn/button'
import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { ArrowDownNarrowWide, ArrowDownWideNarrow, Funnel, RotateCw } from 'lucide-react'
import { cn } from '@/utils/clsxm'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { KubernetesCluster } from '@ror/js-api-client'
import { ClusterSearch } from '@/components/ui/cluster/cluster-search'
import { User } from 'next-auth'
import { useRouter, usePathname } from 'next/navigation'

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
  user: User
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
    value: 'gpu',
    label: 'GPU usage',
  },
  {
    value: 'disk',
    label: 'Disk usage',
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
  {
    value: 'datacenterName',
    label: 'Datacenter name',
  },
  {
    value: 'datacenterProvider',
    label: 'Datacenter provider',
  },
  {
    value: 'environment',
    label: 'Environment',
  },
  {
    value: 'serviceTags',
    label: 'Service tags',
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
    value: 'datacenterName',
    label: 'Datacenter',
  },
  {
    value: 'datacenterProvider',
    label: 'Datacenter provider',
  },
  {
    value: 'environment',
    label: 'Environment',
  },
]

const environments: Option[] = [
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

const filterOptions = [
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
]

export const PageView = ({ className, user, clusters, params }: PageViewProps) => {
  const DEFAULT_LIMIT = 10
  const DEFAULT_PAGE = 1

  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE
  const filtersOpen = params.filters === 'open'
  const router = useRouter()
  const pathname = usePathname()

  const safeClusters = useMemo(() => {
    return clusters.filter(
      (cluster) => cluster.kubernetescluster?.spec?.data && typeof cluster.kubernetescluster.spec.data === 'object'
    )
  }, [clusters])

  const [selectedDisplayData, setSelectedDisplayData] = useState<ClusterCardDisplayData[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchResults, setSearchResults] = useState<KubernetesCluster[]>(safeClusters)

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

  const clearUrl = () => {
    router.replace(pathname, { scroll: false })
  }

  const handleRefreshFilters = () => {
    setSelectedFilters({})
    setSelectedDisplayData([])
    clearUrl()
  }

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

  // Reset search results when safeClusters changes (initial load or data refresh)
  useEffect(() => {
    setSearchResults(safeClusters)
  }, [safeClusters])

  const filteredClusters = useMemo(() => {
    return safeClusters.filter((cluster) => {
      const env = cluster.kubernetescluster?.spec?.data?.environment
      const dc = cluster.kubernetescluster?.spec?.data?.datacenter
      const ws = cluster.kubernetescluster?.spec?.data?.workspace

      const envFilter = selectedFilters['Environments']
      const dcFilter = selectedFilters['Datacenters']
      const wsFilter = selectedFilters['Workspaces']

      // If a filter is applied and the value is missing => exclude
      if (envFilter?.length && !env) return false
      if (dcFilter?.length && !dc) return false
      if (wsFilter?.length && !ws) return false

      return (
        (!envFilter?.length || (env && envFilter.includes(env))) &&
        (!dcFilter?.length || (dc && dcFilter.includes(dc))) &&
        (!wsFilter?.length || (ws && wsFilter.includes(ws)))
      )
    })
  }, [safeClusters, selectedFilters])

  // Sort clusters based on the selected sort parameter and order
  const sortedClusters = useMemo(() => {
    if (!params.sort) return filteredClusters

    const sortOrder = params.order === 'desc' ? -1 : 1

    // Determine if current sort is a numeric field where highest values should appear first by default
    const isNumericMetric = ['cpu', 'memory', 'nodes', 'monthlyPrice', 'yearlyPrice'].includes(params.sort || '')

    return [...filteredClusters].sort((a, b) => {
      let valueA, valueB

      switch (params.sort) {
        case 'clusterName':
          valueA = a.metadata?.name || ''
          valueB = b.metadata?.name || ''
          break
        case 'cpu':
          valueA = a.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.percentage || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.percentage || 0
          // Show highest CPU usage first
          return (valueB - valueA) * sortOrder
        case 'memory':
          valueA = a.kubernetescluster?.status?.state?.cluster?.resources?.memory?.percentage || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.resources?.memory?.percentage || 0
          // Show highest memory usage first
          return (valueB - valueA) * sortOrder
        case 'nodes':
          // Sum up all nodepool scales to get total node count
          valueA = a.kubernetescluster?.status?.state?.cluster?.nodepools?.length || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.nodepools?.length || 0
          // Show highest node count first
          return (valueB - valueA) * sortOrder
        case 'monthlyPrice':
          valueA = a.kubernetescluster?.status?.state?.cluster?.price?.monthly || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.price?.monthly || 0
          // Show highest price first
          return (valueB - valueA) * sortOrder
        case 'yearlyPrice':
          valueA = a.kubernetescluster?.status?.state?.cluster?.price?.yearly || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.price?.yearly || 0
          // Show highest price first
          return (valueB - valueA) * sortOrder
        case 'datacenterName':
          valueA = a.kubernetescluster?.spec?.data?.datacenter || ''
          valueB = b.kubernetescluster?.spec?.data?.datacenter || ''
          break
        case 'datacenterProvider':
          valueA = a.kubernetescluster?.spec?.data?.provider || '' // Using provider instead of datacenterProvider
          valueB = b.kubernetescluster?.spec?.data?.provider || ''
          break
        case 'environment':
          valueA = a.kubernetescluster?.spec?.data?.environment || ''
          valueB = b.kubernetescluster?.spec?.data?.environment || ''
          break
        default:
          valueA = a.metadata?.name || ''
          valueB = b.metadata?.name || ''
      }

      // For numeric fields, we want to show highest values first by default
      if (isNumericMetric && typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueB - valueA) * sortOrder
      }

      // Handle string comparison for alphabetic fields
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * sortOrder
      }

      // Default case: compare as strings
      return String(valueA).localeCompare(String(valueB)) * sortOrder
    })
  }, [filteredClusters, params.sort, params.order])

  // Calculate page count based on filtered clusters
  const pageCount = Math.ceil(filteredClusters.length / limit)

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
        <Button
          type='button'
          onClick={() => {
            handleRefreshFilters()
          }}
          aria-label='Reset filters'
          title='Reset filters'
          className='gap-2'
        >
          <RotateCw className='h-4 w-4' />
          Refresh
        </Button>
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
              value={(selectedFilters[option.label] || []).map((v) => ({ value: v, label: v }))}
              onChange={(selectedOptions) => {
                setSelectedFilters((prev) => ({
                  ...prev,
                  [option.label]: selectedOptions.map((opt) => opt.value),
                }))
              }}
              defaultOptions={option.data}
              placeholder={option.placeholder}
              hideClearAllButton
              hidePlaceholderWhenSelected
              emptyIndicator={<p className='text-center text-sm'>No results found</p>}
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
            user={user}
            data={(params.sort ? sortedClusters : filteredClusters)
              .filter((c) =>
                searchResults.some(
                  (sr) =>
                    sr.metadata?.name === c.metadata?.name ||
                    sr.kubernetescluster?.spec?.data?.clusterId === c.kubernetescluster?.spec?.data?.clusterId
                )
              )
              .slice(
                paginationState.pageIndex * paginationState.pageSize,
                (paginationState.pageIndex + 1) * paginationState.pageSize
              )}
            selectedDisplayData={selectedDisplayData}
            pagination={paginationState}
            totalCount={
              (params.sort ? sortedClusters : filteredClusters).filter((c) =>
                searchResults.some(
                  (sr) =>
                    sr.metadata?.name === c.metadata?.name ||
                    sr.kubernetescluster?.spec?.data?.clusterId === c.kubernetescluster?.spec?.data?.clusterId
                )
              ).length
            }
            pageCount={pageCount}
          />
        ) : (
          <div className='flex flex-wrap gap-6'>
            {searchResults.length > 0 ? (
              // Apply filtering and sorting to the search results
              searchResults
                // Filter by ID instead of object reference to handle search results better
                .filter((searchCluster) =>
                  filteredClusters.some(
                    (filteredCluster) =>
                      searchCluster.metadata?.name === filteredCluster.metadata?.name ||
                      searchCluster.kubernetescluster?.spec?.data?.clusterId ===
                        filteredCluster.kubernetescluster?.spec?.data?.clusterId
                  )
                )
                .sort((a, b) => {
                  // If we have a sort parameter, use the sorted order
                  if (params.sort) {
                    // Find matching clusters in sortedClusters by name/id
                    const sortedA = sortedClusters.find(
                      (sc) =>
                        sc.metadata?.name === a.metadata?.name ||
                        sc.kubernetescluster?.spec?.data?.clusterId === a.kubernetescluster?.spec?.data?.clusterId
                    )
                    const sortedB = sortedClusters.find(
                      (sc) =>
                        sc.metadata?.name === b.metadata?.name ||
                        sc.kubernetescluster?.spec?.data?.clusterId === b.kubernetescluster?.spec?.data?.clusterId
                    )

                    // Get indices from sortedClusters (or use max value if not found)
                    const indexA = sortedA ? sortedClusters.indexOf(sortedA) : Number.MAX_SAFE_INTEGER
                    const indexB = sortedB ? sortedClusters.indexOf(sortedB) : Number.MAX_SAFE_INTEGER

                    return indexA - indexB
                  }
                  // If no sort parameter, maintain search result order
                  return 0
                })
                .map((cluster) => {
                  const clusterId = cluster.kubernetescluster?.spec?.data?.clusterId || crypto.randomUUID()
                  return (
                    <ClusterCard
                      key={clusterId}
                      user={user}
                      cluster={cluster}
                      displayData={
                        selectedDisplayData?.length > 0
                          ? selectedDisplayData
                          : displayDataOptions?.map((o) => o.value as ClusterCardDisplayData) || []
                      }
                    />
                  )
                })
            ) : (
              <p className='text-muted-foreground'>
                {searchResults.length === 0
                  ? 'No cluster matching this search query exists.'
                  : 'No cluster matching both search query and filters exists.'}
              </p>
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
