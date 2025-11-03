'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { VirtualMachineDisks } from '@ror/js-api-client'

export const disksColumns: ColumnDef<VirtualMachineDisks>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Id',
    accessorKey: 'id',
  },
  {
    header: 'Size (GB)',
    accessorKey: 'sizeBytes',
    cell: ({ getValue }) => {
      const value = getValue()
      return value != null ? (Number(value) / 1024 ** 3).toFixed(2) : '-'
    },
  },
  {
    header: 'Usage (GB)',
    accessorKey: 'usageBytes',
    cell: ({ getValue }) => {
      const value = getValue()
      return value != null ? (Number(value) / 1024 ** 3).toFixed(2) : '-'
    },
  },
  {
    header: 'Mounted',
    accessorKey: 'isMounted',
    cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
  },
  {
    header: 'Type',
    accessorKey: 'type',
  },
]
