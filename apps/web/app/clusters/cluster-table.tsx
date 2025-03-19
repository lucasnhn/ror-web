'use client'
import { format } from 'date-fns'
import { convertBytes } from '@/utils/bytes'
import { createColumnHelper } from '@tanstack/react-table'
import type { ClusterListItem } from '@ror/js-api-client'
import Link from 'next/link'
import { DataTable } from '@/components/common/data-table'
import type { DataTableColumnDef, DataTablePagination } from '@/components/common/data-table'
import { HealthStatus } from '@/components/common/health-status'
import { useRouter, useSearchParams } from 'next/navigation'

const columnHelper = createColumnHelper<ClusterListItem>()

const dataTableColumns = [
  columnHelper.accessor('clusterName', {
    header: 'Name',
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
    cell: (info) => {
      const value = info.getValue()
      return <HealthStatus status={value} />
    },
  }),
  columnHelper.accessor('metrics.cpuPercentage', {
    header: 'CPU',
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
    cell: (info) => {
      const lastObserved = new Date(info.getValue())
      const formatted = format(lastObserved, 'dd LLL, yyyy - HH:mm:ss')
      return <span>{formatted}</span>
    },
  }),
  columnHelper.accessor('created', {
    header: 'Created at',
    cell: (info) => {
      const createdAt = format(info.getValue(), 'dd LLL, yyyy - HH:mm:ss')
      return <span>{createdAt}</span>
    },
  }),
  columnHelper.accessor((info) => info.versions?.nhnTooling.version ?? '', {
    header: 'Tooling',
    cell: (info) => {
      const version = info.getValue()
      return <span>{version}</span>
    },
  }),
  columnHelper.accessor((info) => info.metadata?.project?.name ?? '', {
    header: 'Project',
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

  const updateSearchParams = (newSearchParams: URLSearchParams) => {
    const url = '/clusters'

    // If the current search params are different from the new params
    // then push a new url
    const mergedSearchParams = new URLSearchParams(currentSearchParams)
    newSearchParams.forEach((v, k) => {
      mergedSearchParams.set(k, v)
    })

    const newUrl = mergedSearchParams.size > 0 ? `${url}?${mergedSearchParams.toString()}` : url

    router.push(newUrl)
  }

  const handleOnPaginationChange = (state: DataTablePagination) => {
    const params = new URLSearchParams()
    params.set('page', (state.pageIndex + 1).toString())
    params.set('limit', state.pageSize.toString())
    updateSearchParams(params)
  }

  return (
    <div className='max-w-screen overflow-x-auto'>
      <DataTable
        data={data}
        totalCount={totalCount}
        pageCount={pageCount}
        columns={dataTableColumns}
        pagination={pagination}
        onPaginationChange={handleOnPaginationChange}
        gridTemplateColumns={`repeat(8, minmax(max-content, 1fr))`}
      />
    </div>
  )
}
