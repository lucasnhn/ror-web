'use client'
import { format } from 'date-fns'
import { convertBytes } from '@/utils/bytes'
import { createColumnHelper } from '@tanstack/react-table'
import type { ClusterListItem } from '@ror/js-api-client'
import Link from 'next/link'
import { DataTable } from '@/components/common/data-table'
import type { DataTableColumnDef, DataTablePagination, DataTableSorting } from '@/components/common/data-table'
import { HealthStatus } from '@/components/common/health-status'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

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
        <Link href={`/clusters/${clusterId}`} className='pr-2 text-(--r-link-primary) underline'>
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
  columnHelper.accessor('lastObserved', {
    header: 'Last heartbeat',
    enableSorting: false,
    cell: (info) => {
      const lastObserved = new Date(info.getValue())
      const formatted = format(lastObserved, 'dd LLL, yyyy - HH:mm:ss')
      return <span>{formatted}</span>
    },
  }),
  columnHelper.accessor('created', {
    header: 'Created at',
    enableSorting: false,
    cell: (info) => {
      const createdAt = format(info.getValue(), 'dd LLL, yyyy - HH:mm:ss')
      return <span>{createdAt}</span>
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
  const currentSearchParams = useSearchParams()

  const updateSearchParams = useCallback(
    (newSearchParams: URLSearchParams) => {
      const url = '/clusters'
      if (newSearchParams.size > 0) {
        router.push(`${url}?${newSearchParams.toString()}`)
      }
    },
    [router]
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
      console.log('cluster-table handleOnSortChange -> state:', state)
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
      pageSizes={[1, 2, 10]}
    />
  )
}
