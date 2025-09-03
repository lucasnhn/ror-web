'use client'

import { ClusterCard, ClusterCardDisplayData } from '@/components/ui/cluster/cluster-card'
import { SortSelect } from '@/components/ui/sort-select'
import { TabsViewSwitcher } from '@/components/ui/tabs-view-switcher'
import { ClustersTable } from './cluster-table'
import { CodeSnippet } from '@ror/react'
import { Toggle } from '@/components/shadcn/toggle'
import { Button } from '@/components/shadcn/button'
import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { ArrowDownNarrowWide, ArrowDownWideNarrow, Download, Funnel, RotateCw } from 'lucide-react'
import { cn } from '@/utils/clsxm'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { KubernetesCluster } from '@ror/js-api-client'
import { ClusterSearch } from '@/components/ui/cluster/cluster-search'
import { User } from 'next-auth'
import { useRouter, usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import type { WorkSheet } from 'xlsx'
import { NotReadyMessage } from '@/components/ui/not-ready-message'

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
  { value: 'argocd', label: 'ArgoCD' },
  { value: 'grafana', label: 'Grafana' },
  { value: 'rorcli', label: 'ROR CLI' },
  { value: 'kubectl', label: 'Kubectl' },
  { value: 'cpu', label: 'CPU usage' },
  { value: 'memory', label: 'Memory usage' },
  { value: 'gpu', label: 'GPU usage' },
  { value: 'disk', label: 'Disk usage' },
  { value: 'nodes', label: 'Num of nodes' },
  { value: 'monthlyPrice', label: 'Monthly price' },
  { value: 'yearlyPrice', label: 'Yearly price' },
  { value: 'agentVersion', label: 'ROR agent version' },
  { value: 'kubernetesVersion', label: 'Kubernetes version' },
  { value: 'toolingVersion', label: 'NHN tooling version' },
  { value: 'datacenterName', label: 'Datacenter name' },
  { value: 'datacenterProvider', label: 'Datacenter provider' },
  { value: 'environment', label: 'Environment' },
  { value: 'serviceTags', label: 'Service tags' },
]

const sortingOptions = [
  { value: 'clusterName', label: 'Cluster name' },
  { value: 'cpu', label: 'CPU usage' },
  { value: 'memory', label: 'Memory usage' },
  { value: 'nodes', label: 'Num of nodes' },
  { value: 'monthlyPrice', label: 'Price' },
  { value: 'datacenterName', label: 'Datacenter' },
  { value: 'datacenterProvider', label: 'Datacenter provider' },
  { value: 'environment', label: 'Environment' },
]

const environments: Option[] = [
  { value: 'dev', label: 'Dev' },
  { value: 'test', label: 'Test' },
  { value: 'staging', label: 'Staging' },
  { value: 'prod', label: 'Prod' },
  { value: 'qa', label: 'QA' },
]

// TODO: Fetch this from somewhere
const datacenters: Option[] = [
  { value: 'trd1-tanzu', label: 'trd1 - tanzu' },
  { value: 'osl1-tanzu', label: 'osl1 - tanzu' },
  { value: 'trd1cl02-tanzu', label: 'trd1cl02 - tanzu' },
  { value: 'norwayeast-aks', label: 'norwayeast - aks' },
  { value: 'trd1-talos', label: 'trd1 - talos' },
]

// TODO: Fetch this from somewhere
const workspaces: Option[] = [
  { value: 'trd1-amk-prod', label: 'trd1-amk-prod' },
  { value: 'trd1cl02-shp-prod', label: 'trd1cl02-shp-prod' },
  { value: 'trd1cl02-dcn', label: 'trd1cl02-dcn' },
  { value: 't-nhn', label: 't-nhn' },
  { value: 'trd1-amk', label: 'trd1-amk' },
  { value: 'trd1-app', label: 'trd1-app' },
  { value: 'trd1-team-kjernejournal-portal', label: 'trd1-team-kjernejournal-portal' },
]

const filterOptions = [
  { label: 'Environments', placeholder: 'Set environments', data: environments },
  { label: 'Datacenters', placeholder: 'Set datacenters', data: datacenters },
  { label: 'Workspaces', placeholder: 'Set workspaces', data: workspaces },
]

type WorksheetWithCols = WorkSheet & { ['!cols']?: { wch: number }[] }

export const PageView = ({ className, user, clusters, params }: PageViewProps) => {
  const DEFAULT_LIMIT = 10
  const DEFAULT_PAGE = 1

  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE
  const filtersOpen = params.filters === 'open'
  const router = useRouter()
  const pathname = usePathname()

  const safeClusters = useMemo(
    () =>
      clusters.filter(
        (cluster) => cluster.kubernetescluster?.spec?.data && typeof cluster.kubernetescluster.spec.data === 'object'
      ),
    [clusters]
  )

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

  type RorTag = { key?: string; value?: string; properties?: { color?: string } }
  type WithRorMeta = KubernetesCluster & { rormeta?: { tags?: RorTag[] } }

  const exportableFromCluster = (c: KubernetesCluster) => {
    const spec = c.kubernetescluster?.spec
    const data = spec?.data ?? {}
    const workers = spec?.topology?.workers?.nodePools ?? []

    const state = c.kubernetescluster?.status?.state ?? {}
    const cluster = state.cluster ?? {}
    const resources = cluster.resources ?? {}
    const price = cluster.price ?? {}

    const versions = state.versions ?? []
    const versionByName = (name: string) => versions.find((v) => v?.name === name)?.version ?? null

    const tagsArr = (c as WithRorMeta)?.rormeta?.tags ?? []
    const serviceTags = Array.isArray(tagsArr)
      ? tagsArr
          .map((t) => t?.value ?? t?.key ?? '')
          .filter(Boolean)
          .join(' ')
      : ''

    const nodePoolCount =
      Array.isArray(workers) && workers.length > 0
        ? workers.length
        : Array.isArray(cluster.nodepools)
          ? cluster.nodepools.length
          : null

    return {
      clusterId: data?.clusterId ?? '',
      clusterName: c.metadata?.name ?? '',
      workspaceName: data?.workspace ?? '',
      datacenterName: data?.datacenter ?? '',
      provider: data?.provider ?? '',
      environment: data?.environment ?? '',

      cpuPercentage: resources?.cpu?.percentage ?? null,
      memoryPercentage: resources?.memory?.percentage ?? null,
      gpuPercentage: resources?.gpu?.percentage ?? null,
      diskPercentage: resources?.disk?.percentage ?? null,
      nodePoolCount,

      monthlyPrice: price?.monthly ?? null,
      yearlyPrice: price?.yearly ?? null,

      rorAgentVersion: versionByName('agent'),
      kubernetesVersion: versionByName('kubernetes'),
      nhnToolingVersion: versionByName('nhnTooling'),

      serviceTags,
    }
  }

  const toCSV = (rows: Array<Record<string, unknown>>) => {
    if (!rows.length) return ''
    const headers = Object.keys(rows[0])
    const esc = (v: unknown) => {
      if (v === null || v === undefined) return ''
      const s = String(v)
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const lines = [headers.join(',')]
    for (const row of rows) lines.push(headers.map((h) => esc(row[h])).join(','))
    return lines.join('\n')
  }

  const downloadBlob = (content: string, filename: string, type = 'text/csv;charset=utf-8;') => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const autosizeCols = (rows: Array<Record<string, unknown>>) => {
    if (!rows.length) return []
    const headers = Object.keys(rows[0])
    return headers.map((h) => {
      const maxLen = Math.max(h.length, ...rows.map((r) => (r[h] == null ? 0 : String(r[h]).length)))
      return { wch: Math.min(Math.max(maxLen + 2, 10), 40) }
    })
  }

  // ---------- Toggle/Sort params ----------

  const toggleParams = useMemo(() => {
    const entries: [string, string][] = (Object.entries(params) as Array<[string, unknown]>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])

    const newParams = new URLSearchParams(entries)
    if (filtersOpen) {
      newParams.delete('filters')
    } else {
      newParams.set('filters', 'open')
    }
    return `/clusters?${newParams.toString()}`
  }, [params, filtersOpen])

  const toggleSortParams = useMemo(() => {
    if (!params.sort) return null
    const entries: [string, string][] = (Object.entries(params) as Array<[string, unknown]>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])

    const newParams = new URLSearchParams(entries)
    const currentOrder = newParams.get('order') === 'desc' ? 'desc' : 'asc'
    newParams.set('order', currentOrder === 'desc' ? 'asc' : 'desc')
    return { url: `/clusters?${newParams.toString()}`, isDesc: currentOrder === 'desc' }
  }, [params])

  // Reset search results when safeClusters changes
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

  const sortedClusters = useMemo(() => {
    if (!params.sort) return filteredClusters
    const sortOrder = params.order === 'desc' ? -1 : 1
    const isNumericMetric = ['cpu', 'memory', 'nodes', 'monthlyPrice', 'yearlyPrice'].includes(params.sort || '')

    return [...filteredClusters].sort((a, b) => {
      let valueA: string | number, valueB: string | number
      switch (params.sort) {
        case 'clusterName':
          valueA = a.metadata?.name || ''
          valueB = b.metadata?.name || ''
          break
        case 'cpu':
          valueA = a.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.percentage || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.percentage || 0
          return (valueB - valueA) * sortOrder
        case 'memory':
          valueA = a.kubernetescluster?.status?.state?.cluster?.resources?.memory?.percentage || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.resources?.memory?.percentage || 0
          return (valueB - valueA) * sortOrder
        case 'nodes':
          valueA = a.kubernetescluster?.status?.state?.cluster?.nodepools?.length || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.nodepools?.length || 0
          return (valueB - valueA) * sortOrder
        case 'monthlyPrice':
          valueA = a.kubernetescluster?.status?.state?.cluster?.price?.monthly || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.price?.monthly || 0
          return (valueB - valueA) * sortOrder
        case 'yearlyPrice':
          valueA = a.kubernetescluster?.status?.state?.cluster?.price?.yearly || 0
          valueB = b.kubernetescluster?.status?.state?.cluster?.price?.yearly || 0
          return (valueB - valueA) * sortOrder
        case 'datacenterName':
          valueA = a.kubernetescluster?.spec?.data?.datacenter || ''
          valueB = b.kubernetescluster?.spec?.data?.datacenter || ''
          break
        case 'datacenterProvider':
          valueA = a.kubernetescluster?.spec?.data?.provider || ''
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

      if (isNumericMetric && typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueB - valueA) * sortOrder
      }
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * sortOrder
      }
      return String(valueA).localeCompare(String(valueB)) * sortOrder
    })
  }, [filteredClusters, params.sort, params.order])

  const getFilteredClusterList = () => {
    const base = params.sort ? sortedClusters : filteredClusters
    return base.filter((c) =>
      searchResults.some(
        (sr) =>
          sr.metadata?.name === c.metadata?.name ||
          sr.kubernetescluster?.spec?.data?.clusterId === c.kubernetescluster?.spec?.data?.clusterId
      )
    )
  }

  const handleExportAllCSV = () => {
    try {
      const rows = safeClusters.map(exportableFromCluster)
      const csv = toCSV(rows)
      if (!csv) return console.warn('[Export] No data to export')
      downloadBlob(csv, 'ror-clusters-all.csv')
    } catch (e) {
      console.error('[Export] Export All CSV failed', e)
    }
  }

  const handleExportAllExcel = async () => {
    try {
      const rows = safeClusters.map(exportableFromCluster)
      if (!rows.length) return console.warn('[Export] No data to export')
      const XLSX = await import('xlsx')
      const ws = XLSX.utils.json_to_sheet(rows) as WorksheetWithCols
      ws['!cols'] = autosizeCols(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Clusters')
      XLSX.writeFile(wb, 'ror-clusters-all.xlsx', { bookType: 'xlsx' })
    } catch (e) {
      console.error('[Export] Export All Excel failed', e)
    }
  }

  const handleExportFilteredCSV = () => {
    try {
      const rows = getFilteredClusterList().map(exportableFromCluster)
      const csv = toCSV(rows)
      if (!csv) return console.warn('[Export] No data to export')
      downloadBlob(csv, 'ror-clusters-filtered.csv')
    } catch (e) {
      console.error('[Export] Filtered CSV export failed', e)
    }
  }

  const handleExportFilteredExcel = async () => {
    try {
      const rows = getFilteredClusterList().map(exportableFromCluster)
      if (!rows.length) return console.warn('[Export] No data to export')
      const XLSX = await import('xlsx')
      const ws = XLSX.utils.json_to_sheet(rows) as WorksheetWithCols
      ws['!cols'] = autosizeCols(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Clusters')
      XLSX.writeFile(wb, 'ror-clusters-filtered.xlsx', { bookType: 'xlsx' })
    } catch (e) {
      console.error('[Export] Filtered Excel export failed', e)
    }
  }
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
          onClick={handleRefreshFilters}
          aria-label='Reset filters'
          title='Reset filters'
          className='gap-2'
        >
          <RotateCw className='h-4 w-4' />
          Refresh
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportFilteredCSV}>Export Filtered (CSV)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportFilteredExcel}>Export Filtered (Excel)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportAllCSV}>Export All (CSV)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportAllExcel}>Export All (Excel)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TabsViewSwitcher />
      </div>
    </div>
  )

  const renderFilterSection = () =>
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

  return (
    <div className={cn(className, '@container')}>
      <div className={cn('border-b', filtersOpen && 'pb-2')}>
        <div className={cn('mx-12 flex items-center min-h-28 py-6 ', filtersOpen && 'w-[calc(100%-6rem)] border-b')}>
          {renderControls()}
        </div>
        {renderFilterSection()}
      </div>

      <NotReadyMessage className='mx-12 my-6'>
        Welcome to the new ROR web! This site is currently under development, so feel free to look around, but don't
        expect finished functionality or that all data is present. The development team is working hard on delivering a
        complete product as quick as possible :)
      </NotReadyMessage>

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
              searchResults
                .filter((searchCluster) =>
                  filteredClusters.some(
                    (filteredCluster) =>
                      searchCluster.metadata?.name === filteredCluster.metadata?.name ||
                      searchCluster.kubernetescluster?.spec?.data?.clusterId ===
                        filteredCluster.kubernetescluster?.spec?.data?.clusterId
                  )
                )
                .sort((a, b) => {
                  if (params.sort) {
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
                    const indexA = sortedA ? sortedClusters.indexOf(sortedA) : Number.MAX_SAFE_INTEGER
                    const indexB = sortedB ? sortedClusters.indexOf(sortedB) : Number.MAX_SAFE_INTEGER
                    return indexA - indexB
                  }
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
