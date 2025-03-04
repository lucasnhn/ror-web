'use client'
import { format } from 'date-fns'
import { DataTable } from '@/components/common/data-table'
import { convertBytes } from '@/utils/bytes'
import { createColumnHelper } from '@tanstack/react-table'
import type { Cluster } from '@ror/js-api-client'

import Link from 'next/link'

const columnHelper = createColumnHelper<Cluster>()

const dataTableColumns = [
  columnHelper.accessor('clusterName', {
    header: 'Name',
    cell: (info) => {
      const clusterName = info.getValue()
      const rowOriginal = info.row.original
      const clusterId = rowOriginal.clusterId
      return <Link href={`/clusters/${clusterId}`}>{clusterName}</Link>
    },
  }),
  columnHelper.accessor('healthStatus.health', {
    header: 'Status',
    cell: (info) => {
      const value = info.getValue()
      return (
        <span className={value === 1 ? 'text-green-500' : 'text-red-500'}>{value === 1 ? 'Healthy' : 'Unhealthy'}</span>
      )
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
]

interface ClusterTableProps<T> {
  data: T[]
}

export function ClustersTable<T extends Cluster>({ data }: ClusterTableProps<T>) {
  return (
    <div className='max-w-screen overflow-x-auto'>
      <DataTable data={data} columns={dataTableColumns} gridTemplateColumns={`repeat(8, minmax(max-content, 1fr))`} />
    </div>
  )
}
