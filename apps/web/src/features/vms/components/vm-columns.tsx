'use client'

import type { VirtualMachine } from '@ror/js-api-client'
import type { DataTableColumnDef } from '@/components/ui/data-table'
import Link from 'next/link'
import { Pill } from '@/components/shadcn/pill'
import { vmCardColors } from '@/features/vms/utils/env-colors'
import { User } from 'next-auth'
import { VMCardData } from '@/features/vms/types/vm-card-type'
import { createColumnHelper } from '@tanstack/react-table'
import {
  getVmArchitecture,
  getVmFamily,
  getVmHostName,
  getVmId,
  getVmName,
  getVmPowerState,
  getVmVersion,
} from '../utils/vms'

const columnHelper = createColumnHelper<VirtualMachine>()

export const getVMTableColumns = (
  user?: User,
  selectedDisplayData?: VMCardData[]
): DataTableColumnDef<VirtualMachine>[] => {
  const showAllVMs = !selectedDisplayData || selectedDisplayData.length === 0
  const isVisible = (data: VMCardData) => showAllVMs || selectedDisplayData.includes(data)

  return [
    columnHelper.accessor((row) => row.metadata?.name ?? 'Unnamed VM', {
      id: 'hostName',
      header: 'Hostname',
      enableSorting: true,
      sortingFn: 'text',
      cell: (info) => {
        const hostname = String(info.getValue() ?? '')
        const vm = info.row.original
        const vmHostName = getVmHostName(vm) || ''
        return (
          <Link
            href={`/vms/${vmHostName}`}
            className='pr-2 text-blue-600 dark:text-blue-500 underline'
            onClick={() => localStorage.setItem('selectedVm', JSON.stringify(vm))}
          >
            {hostname}
          </Link>
        )
      },
    }),
    isVisible('id') &&
      columnHelper.accessor(
        (row) => {
          const osID = getVmId(row)
          return osID
        },
        {
          id: 'id',
          header: 'ID',
          enableSorting: true,
          sortingFn: 'text',
          cell: (info) => {
            const osID = info.getValue()
            return <span>{osID}</span>
          },
        }
      ),
    isVisible('name') &&
      columnHelper.accessor(
        (row) => {
          const osName = getVmName(row)
          return osName
        },
        {
          id: 'name',
          header: 'Name',
          enableSorting: true,
          sortingFn: 'text',
          cell: (info) => {
            const name = info.getValue()
            return <span>{name}</span>
          },
        }
      ),
    isVisible('family') &&
      columnHelper.accessor(
        (row) => {
          const osFamily = getVmFamily(row)
          return osFamily
        },
        {
          id: 'family',
          header: 'Family',
          enableSorting: false,
          cell: (info) => {
            const osFamily = info.getValue()
            return <span>{osFamily}</span>
          },
        }
      ),
    isVisible('version') &&
      columnHelper.accessor((row) => getVmVersion(row), {
        id: 'version',
        header: 'Version',
        enableSorting: false,
        cell: (info) => {
          const version = info.getValue()
          return <span>{version}</span>
        },
      }),
    isVisible('architecture') &&
      columnHelper.accessor((row) => getVmArchitecture(row), {
        id: 'architecture',
        header: 'Architecture',
        enableSorting: false,
        cell: (info) => {
          const architecture = info.getValue()
          return <span>{architecture}</span>
        },
      }),
    isVisible('toolVersion') &&
      columnHelper.accessor((row) => getVmVersion(row), {
        id: 'toolVersion',
        header: 'Tool Version',
        enableSorting: false,
        cell: (info) => {
          const toolVersion = info.getValue()
          return <span>{toolVersion}</span>
        },
      }),
    columnHelper.accessor((row) => getVmPowerState(row) ?? '', {
      id: 'powerState',
      header: 'Power state',
      enableSorting: false,
      cell: (info) => {
        const osID = info.getValue()
        return (
          <Pill variant={vmCardColors[osID ?? 'undefined']} className='px-3'>
            {(osID ?? 'Undefined').charAt(0).toUpperCase() + (osID ?? 'Undefined').slice(1)}
          </Pill>
        )
      },
    }),
  ].filter(Boolean) as DataTableColumnDef<VirtualMachine>[]
}
