'use client'

import type { VirtualMachine } from '@ror/js-api-client'
import type { DataTableColumnDef } from '@/components/ui/data-table'
import Link from 'next/link'
import { Pill } from '@/components/shadcn/pill'
import { vmCardColors } from '@/features/vms/utils/env-colors'
import { User } from 'next-auth'
import { VMColumnsData } from '@/features/vms/types/vm-types'
import { createColumnHelper } from '@tanstack/react-table'
import {
  getSpecCoresPerSocket,
  getSpecMemory,
  getSpecSockets,
  getStatusCpuUsage,
  getTeamName,
  getVmArchitecture,
  getVmDiskSizes,
  getVmDiskUsages,
  getVmFamily,
  getVmHostName,
  getVmId,
  getVmName,
  getVmPowerState,
  getVmToolVersion,
  getVmVersion,
} from '../utils/vms'

const columnHelper = createColumnHelper<VirtualMachine>()

export const getVMTableColumns = (
  user?: User,
  selectedDisplayData?: VMColumnsData[]
): DataTableColumnDef<VirtualMachine>[] => {
  const showAllVMs = !selectedDisplayData || selectedDisplayData.length === 0
  const isVisible = (data: VMColumnsData) => {
    if (data === 'id' || data === 'architecture') {
      return selectedDisplayData?.includes(data) ?? false
    }
    return showAllVMs || selectedDisplayData.includes(data)
  }

  return [
    columnHelper.accessor((row) => getVmHostName(row) ?? 'Unnamed VM', {
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
    isVisible('team') &&
      columnHelper.accessor(
        (row) => {
          const team = getTeamName(row)
          return team
        },
        {
          id: 'team',
          header: 'Team',
          enableSorting: true,
          sortingFn: 'text',
          cell: (info) => {
            const team = info.getValue()
            return <span>{team}</span>
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
          header: 'OS-version',
          enableSorting: true,
          sortingFn: 'text',
          cell: (info) => {
            const name = info.getValue()
            return <span>{name}</span>
          },
        }
      ),
    // isVisible('family') &&
    //   columnHelper.accessor(
    //     (row) => {
    //       const osFamily = getVmFamily(row)
    //       return osFamily
    //     },
    //     {
    //       id: 'family',
    //       header: 'OS-type',
    //       enableSorting: false,
    //       cell: (info) => {
    //         const osFamily = info.getValue()
    //         return <span>{osFamily}</span>
    //       },
    //     }
    //   ),
    //Change this getters to the correct ones when available
    isVisible('disk-size') &&
      columnHelper.accessor((row) => getVmDiskSizes(row), {
        id: 'disk-size',
        header: 'Disk size (usage)',
        enableSorting: false,
        cell: (info) => {
          const diskSizes = info.getValue()
          const diskSizesInGB = diskSizes.map((size) => ((size ?? 0) / 1024 ** 3).toFixed(2) + ' GB')
          const diskUsage = getVmDiskUsages(info.row.original)
          const diskUsageInGB = diskUsage.map((usage) => ((usage ?? 0) / 1024 ** 3).toFixed(2) + ' GB')
          return (
            <div className='flex flex-wrap gap-2'>
              {diskSizesInGB.map((size, idx) => (
                <span key={idx} className='whitespace-nowrap'>
                  {size} <span className='text-xs text-gray-500'>({diskUsageInGB[idx] ?? '0 GB'})</span>
                </span>
              ))}
            </div>
          )
        },
      }),
    isVisible('memory') &&
      columnHelper.accessor((row) => getSpecMemory(row), {
        id: 'memory',
        header: 'Memory',
        enableSorting: false,
        cell: (info) => {
          const memory = info.getValue()
          const memoryInGB = ((memory ?? 0) / 1024 ** 3).toFixed(2)
          return <span>{memoryInGB} GB</span>
        },
      }),
    isVisible('sockets') &&
      columnHelper.accessor((row) => getSpecSockets(row), {
        id: 'sockets',
        header: 'Sockets (corePrSocket)',
        enableSorting: false,
        cell: (info) => {
          const sockets = info.getValue()
          const coresPerSocket = getSpecCoresPerSocket(info.row.original)
          return (
            <span>
              {sockets} ({coresPerSocket})
            </span>
          )
        },
      }),
    isVisible('cpu') &&
      columnHelper.accessor((row) => getStatusCpuUsage(row), {
        id: 'cpu',
        header: 'CPU Usage',
        enableSorting: false,
        cell: (info) => {
          const cpuUsage = info.getValue()
          return <span>{cpuUsage} %</span>
        },
      }),
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
      columnHelper.accessor((row) => getVmToolVersion(row), {
        id: 'toolVersion',
        header: 'VMware Tools version',
        enableSorting: false,
        cell: (info) => {
          const toolVersion = info.getValue()
          return <span>{toolVersion}</span>
        },
      }),
    columnHelper.accessor((row) => getVmPowerState(row) ?? '', {
      id: 'powerState',
      header: 'Power',
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
