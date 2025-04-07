'use client'

import { DataView } from '@/components/ui/data-view'
import type { Ingress } from '@ror/js-api-client'
import { ColumnDef, createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'

const columnHelper = createColumnHelper<Ingress>()

const columns = [
  columnHelper.accessor('metadata.name', {
    id: 'name',
    header: 'Name',
  }),
  columnHelper.accessor('ingress.spec.ingressClassName', {
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
  columnHelper.accessor('metadata.namespace', {
    header: 'Namespace',
  }),
  columnHelper.display({
    header: 'Hostname',
    cell: (info) => {
      const hostnames = info.row.original?.ingress.status.loadBalancer.ingress?.map((rule) => rule.hostname) || []

      return (
        <div className='flex flex-wrap gap-2'>
          {hostnames.map((hostname) => (
            <a
              key={hostname}
              href={`https://${hostname}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-link truncate'
            >
              <span>{hostname}</span>
              <ExternalLink className='w-5 h-5 text-current shrink-0' />
            </a>
          ))}
        </div>
      )
    },
  }),
  columnHelper.display({
    header: 'IP Address',
    cell: (info) => {
      const ipAddresses = info.row.original?.ingress.status.loadBalancer.ingress?.map((rule) => rule.ip) || []
      const lastIpAddress = ipAddresses.at(-1)

      if (!lastIpAddress) {
        return <div>Missing …</div>
      }

      return <span>{lastIpAddress}</span>
    },
  }),
] as ColumnDef<Ingress>[]

interface ClusterIngressesDataViewProps {
  ingresses: Ingress[]
}

export function ClusterIngressesDataView({ ingresses }: ClusterIngressesDataViewProps) {
  const table = useReactTable({
    data: ingresses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <DataView table={table} />
}
