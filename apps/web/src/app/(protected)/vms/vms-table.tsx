import { User } from 'next-auth'
import { createColumnHelper } from '@tanstack/react-table'
import type { DataTableColumnDef, DataTablePagination } from '@/components/ui/data-table'
import { VirtualMachine } from './interfaces'
import { VMCardData } from '@/components/ui/vm/vm-card'
import Link from 'next/link'
import { Pill } from '@/components/shadcn/pill'
import { envColors } from '@/components/ui/vm/vm-card'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { DataTable } from '@/components/ui/data-table'

const columnHelper = createColumnHelper<VirtualMachine>()

const getVMTableColumns = (user?: User, selectedDisplayData?: VMCardData[]): DataTableColumnDef<VirtualMachine>[] => {
  const showAllVMs = !selectedDisplayData || selectedDisplayData.length === 0
  const isVisible = (data: VMCardData) => showAllVMs || selectedDisplayData.includes(data)

  return [
    columnHelper.accessor((row) => row.metadata?.name ?? 'Unnamed VM', {
      id: 'os_hostName',
      header: 'Host name',
      enableSorting: true,
      sortingFn: 'text',
      cell: (info) => {
        const hostname = String(info.getValue() ?? '')
        const vm = info.row.original
        const vmID = info.row.original.virtualmachine?.status?.operatingsystem?.hostname ?? ''
        return (
          <Link
            href={`/vms/${vmID}`}
            className='pr-2 text-blue-600 dark:text-blue-500 underline'
            onClick={() => localStorage.setItem('selectedVm', JSON.stringify(vm))}
          >
            {hostname}
          </Link>
        )
      },
    }),
    isVisible('os_id') &&
      columnHelper.accessor(
        (row) => {
          const osID = row.virtualmachine?.status?.operatingsystem?.id
          return osID
        },
        {
          id: 'os_id',
          header: 'ID',
          enableSorting: true,
          sortingFn: 'text',
          cell: (info) => {
            const osID = info.getValue()
            return <span>{osID}</span>
          },
        }
      ),
    isVisible('os_name') &&
      columnHelper.accessor(
        (row) => {
          const osName = row.virtualmachine?.status?.operatingsystem?.name
          return osName
        },
        {
          id: 'os_name',
          header: 'Name',
          enableSorting: true,
          sortingFn: 'text',
          cell: (info) => {
            const name = info.row.original.virtualmachine?.status?.operatingsystem?.name
            return <span>{name}</span>
          },
        }
      ),
    isVisible('os_family') &&
      columnHelper.accessor(
        (row) => {
          const osFamily = row.virtualmachine?.status?.operatingsystem?.family
          return osFamily
        },
        {
          id: 'os_family',
          header: 'Family',
          enableSorting: false,
          cell: (info) => {
            const osFamily = info.getValue()
            return <span>{osFamily}</span>
          },
        }
      ),
    isVisible('os_version') &&
      columnHelper.accessor((row) => row.virtualmachine?.status?.operatingsystem?.version, {
        id: 'os_version',
        header: 'Version',
        enableSorting: false,
        cell: (info) => {
          const version = info.getValue()
          return <span>{version}</span>
        },
      }),
    isVisible('os_architecture') &&
      columnHelper.accessor((row) => row.virtualmachine?.status?.operatingsystem?.architecture, {
        id: 'os_architecture',
        header: 'Architecture',
        enableSorting: false,
        cell: (info) => {
          const architecture = info.getValue()
          return <span>{architecture}</span>
        },
      }),
    isVisible('os_toolVersion') &&
      columnHelper.accessor((row) => row.virtualmachine?.status?.operatingsystem?.toolversion, {
        id: 'os_toolversion',
        header: 'Tool Version',
        enableSorting: false,
        cell: (info) => {
          const toolVersion = info.getValue()
          return <span>{toolVersion}</span>
        },
      }),
    columnHelper.accessor((row) => row.virtualmachine?.status?.operatingsystem?.powerstate ?? '', {
      id: 'powerState',
      header: 'Power state',
      enableSorting: false,
      cell: (info) => {
        const osID = info.getValue()
        return (
          <Pill variant={envColors[osID ?? 'undefined']} className='px-3'>
            {(osID ?? 'Undefined').charAt(0).toUpperCase() + (osID ?? 'Undefined').slice(1)}
          </Pill>
        )
      },
    }),
  ].filter(Boolean) as DataTableColumnDef<VirtualMachine>[]
}

interface VMTableProps {
  user?: User
  vms: VirtualMachine[]
  selectedDisplayData?: VMCardData[]
  totalCount: number
  pageCount: number
  pagination: DataTablePagination
}

export function VMTable({ user, vms, selectedDisplayData, totalCount, pageCount, pagination }: VMTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  const handleOnPaginationChange = useCallback(
    (state: DataTablePagination) => {
      const searchParams = new URLSearchParams(currentSearchParams)
      searchParams.set('page', (state.pageIndex + 1).toString())
      searchParams.set('limit', state.pageSize.toString())
      router.push(`${pathname}?${searchParams.toString()}`)
    },
    [currentSearchParams, router, pathname]
  )

  return (
    <DataTable
      data={vms}
      totalCount={totalCount}
      pageCount={pageCount}
      columns={getVMTableColumns(user, selectedDisplayData)}
      pagination={pagination}
      onPaginationChange={handleOnPaginationChange}
    />
  )
}
