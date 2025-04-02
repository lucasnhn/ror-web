'use client'
import { convertBytes } from '@/utils/bytes'
import { createColumnHelper } from '@tanstack/react-table'
import type { ClusterListItem } from '@ror/js-api-client'
import Link from 'next/link'
import { DataTable } from '@/components/ui/data-table'
import type { DataTableColumnDef, DataTablePagination, DataTableSorting } from '@/components/ui/data-table'
import { HealthStatus } from '@/components/ui/health-status'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { routes } from '@/config/routes'
import { EnvironmentTag } from '@/components/ui/environment-tag'
import { getArgoTool, getGrafanaTool } from '@/features/clusters/utils/tools'
import { ExternalLink } from 'lucide-react'
import { useDebounce } from '@uidotdev/usehooks'

const columnHelper = createColumnHelper<ClusterListItem>()

const dataTableColumns = [
  columnHelper.accessor('clusterName', {
    header: 'Name',
    enableSorting: true,
    sortingFn: 'text',
    cell: (info) => {
      const clusterName = info.getValue()
      const rowOriginal = info.row.original
      const clusterId = rowOriginal.clusterId
      return (
        <Link href={routes.app.cluster.getHref(clusterId)} className='pr-2 text-(--r-link-primary) underline'>
          {clusterName}
        </Link>
      )
    },
  }),
  columnHelper.accessor('healthStatus.health', {
    header: 'Status',
    enableSorting: false,
    cell: (info) => {
      const value = info.getValue()
      return <HealthStatus status={value} />
    },
  }),
  columnHelper.accessor('environment', {
    header: 'Environment',
    enableSorting: false,
    cell: (info) => {
      const value = info.getValue()
      return <EnvironmentTag environment={value} />
    },
  }),
  columnHelper.accessor('metrics.cpuPercentage', {
    header: 'CPU',
    enableSorting: false,
    cell: (info) => {
      const cpuPercentage = info.getValue()
      const row = info.row.original
      const cpuCount = row.metrics.cpu
      return (
        <span>
          {cpuPercentage}% ({cpuCount} cores)
        </span>
      )
    },
  }),
  columnHelper.accessor('metrics.memoryPercentage', {
    header: 'Memory',
    enableSorting: false,
    cell: (info) => {
      const memoryPercentage = info.getValue()
      const bytes = info.row.original.metrics.memory
      const formattedBytes = convertBytes(bytes, { useBinaryUnits: true })
      return (
        <span>
          {memoryPercentage}% ({formattedBytes})
        </span>
      )
    },
  }),
  columnHelper.accessor((info) => info.versions?.nhnTooling.version ?? '', {
    header: 'Tooling',
    enableSorting: false,
    cell: (info) => {
      const version = info.getValue()
      return <span>{version}</span>
    },
  }),
  columnHelper.accessor((info) => info.metadata?.project?.name ?? '', {
    header: 'Project',
    enableSorting: false,
    cell: (info) => {
      const projectName = info.getValue()
      return <span>{projectName ?? '-'}</span>
    },
  }),
  columnHelper.display({
    header: 'Argo',
    enableSorting: false,
    cell: (info) => {
      const cluster = info.row.original
      const argoUrl = getArgoTool(cluster)
      if (!argoUrl) {
        return 'Missing…'
      }
      return (
        <a
          href={`https://${argoUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-link'
        >
          Open Argo
          <ExternalLink className='w-5 h-5 text-current' />
        </a>
      )
    },
  }),
  columnHelper.display({
    header: 'Grafana',
    enableSorting: false,
    cell: (info) => {
      const cluster = info.row.original
      const grafanaUrl = getGrafanaTool(cluster)
      if (!grafanaUrl) {
        return 'Missing…'
      }
      return (
        <a
          href={`https://${grafanaUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-link'
        >
          Open Grafana
          <ExternalLink className='w-5 h-5 text-current' />
        </a>
      )
    },
  }),
] satisfies DataTableColumnDef<ClusterListItem>[]

interface ClusterTableProps<T> {
  data: T[]
  totalCount: number
  pageCount: number
  pagination: DataTablePagination
}

export function ClustersTable<T extends ClusterListItem>({
  data,
  totalCount,
  pageCount,
  pagination,
}: ClusterTableProps<T>) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  const updateSearchParams = useCallback(
    (newSearchParams: URLSearchParams) => {
      if (newSearchParams.size > 0) {
        router.push(`${pathname}?${newSearchParams.toString()}`)
      }
    },
    [router, pathname]
  )

  const handleOnPaginationChange = useCallback(
    (state: DataTablePagination) => {
      const params = new URLSearchParams(currentSearchParams)
      params.set('page', (state.pageIndex + 1).toString())
      params.set('limit', state.pageSize.toString())
      updateSearchParams(params)
    },
    [currentSearchParams, updateSearchParams]
  )

  const handleOnSortChange = useCallback(
    (state: DataTableSorting) => {
      const params = new URLSearchParams(currentSearchParams)
      if (Array.isArray(state) && typeof state[0] === 'object') {
        params.set('sort', state[0].id)
        params.set('order', state[0].desc ? 'desc' : 'asc')
      } else if (Array.isArray(state) && state.length === 0) {
        params.delete('sort')
        params.delete('order')
      }
      updateSearchParams(params)
    },
    [currentSearchParams, updateSearchParams]
  )

  const handleOnSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value)
  }, [])

  /**
   * Update the search query ("?q=value") parameter based on the debounced search query
   * Reason for doing it is o ensure that the search query is updated only when the user has stopped typing for a certain amount of time.
   */
  useEffect(() => {
    function updateSearchQueryParams() {
      const params = new URLSearchParams(currentSearchParams)
      if (!debouncedSearchQuery || debouncedSearchQuery === '') {
        params.delete('q')
      } else {
        params.set('q', debouncedSearchQuery)
      }
      updateSearchParams(params)
    }
    updateSearchQueryParams()
  }, [debouncedSearchQuery, currentSearchParams, updateSearchParams])

  const sortByField = currentSearchParams.get('sort')
  const sortDirection = currentSearchParams.get('order')

  const sortState: DataTableSorting = sortByField
    ? [
        {
          id: sortByField,
          desc: sortDirection === 'desc',
        },
      ]
    : []

  return (
    <DataTable
      data={data}
      totalCount={totalCount}
      pageCount={pageCount}
      columns={dataTableColumns}
      pagination={pagination}
      sorting={sortState}
      onSortingChange={handleOnSortChange}
      onPaginationChange={handleOnPaginationChange}
      searchQuery={localSearchQuery}
      onSearchChange={handleOnSearchChange}
    />
  )
}
