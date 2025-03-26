'use client'
import { DataTable } from '@/components/ui/data-table'
import { HealthStatus } from '@/components/ui/health-status'
import { ClusterIngress } from '@ror/js-api-client'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<ClusterIngress>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('health', {
    header: 'Status',
    cell: (info) => {
      const value = info.getValue()
      return <HealthStatus status={value} />
    },
  }) as ColumnDef<ClusterIngress>,
  columnHelper.accessor('class', {
    header: 'Infrastructure',
    cell: (info) => {
      const value = info.getValue()

      if (value.endsWith('internett')) {
        return <span>Internet</span>
      } else if (value.endsWith('health')) {
        return 'Helsenett'
      } else if (value.endsWith('datacenter')) {
        return 'Data center'
      }

      return <span>{value}</span>
    },
  }),
  columnHelper.accessor('namespace', {
    header: 'Namespace',
  }),
  columnHelper.display({
    header: 'Hostname',
    cell: (info) => {
      const hostnames = info.row.original?.ingressrules?.map((rule) => rule.hostname) || []

      return (
        <div className='flex flex-wrap gap-2'>
          {hostnames.map((hostname) => (
            <a
              key={hostname}
              href={`https://${hostname}`}
              target='_blank'
              title={hostname}
              className='text-(--r-link-primary) truncate max-w-14'
            >
              {hostname}
            </a>
          ))}
        </div>
      )
    },
  }),
  columnHelper.display({
    header: 'IP Address',
    cell: (info) => {
      const ipAddresses = info.row.original?.ingressrules?.map((rule) => rule.ipaddresses) || []
      const lastIpAddress = ipAddresses.at(-1)

      if (!lastIpAddress) {
        return <div>Missing …</div>
      }

      return <span>{lastIpAddress}</span>
    },
  }),
] satisfies ColumnDef<ClusterIngress, string>[]

interface ClusterIngressesTableProps {
  ingresses: ClusterIngress[]
}

export function ClusterIngressesTable({ ingresses }: ClusterIngressesTableProps) {
  return <DataTable columns={columns} data={ingresses} pageCount={100} pagination={{ pageSize: 100, pageIndex: 0 }} />
}
