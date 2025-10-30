'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { VirtualMachineNetworks } from '@ror/js-api-client'

export const networksColumns: ColumnDef<VirtualMachineNetworks>[] = [
  {
    header: 'Id',
    accessorKey: 'id',
  },
  {
    header: 'DNS',
    accessorKey: 'dns',
  },
  {
    header: 'IPv4',
    accessorKey: 'ipv4',
  },
  {
    header: 'IPv6',
    accessorKey: 'ipv6',
  },
  {
    header: 'MAC',
    accessorKey: 'mac',
  },
  {
    header: 'Gateway',
    accessorKey: 'gateway',
  },
  {
    header: 'Mask',
    accessorKey: 'mask',
  },
]
