'use client'

import { createColumnHelper } from '@tanstack/react-table'
import type { KubernetesCluster } from '@ror/js-api-client'
import Link from 'next/link'
import { DataTable } from '@/components/ui/data-table'
import type { DataTableColumnDef, DataTablePagination, DataTableSorting } from '@/components/ui/data-table'
import { HealthStatus } from '@/components/ui/cluster/health-status'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { routes } from '@/config/routes'
import { EnvironmentTag } from '@/components/ui/environment-tag'
import { ExternalLink } from 'lucide-react'
import { useDebounce } from '@uidotdev/usehooks'

const columnHelper = createColumnHelper<KubernetesCluster>()

const dataTableColumns = [
  columnHelper.accessor((row) => row.metadata.name ?? '', {
    header: 'Name',
    enableSorting: true,
    sortingFn: 'text',
    cell: (info) => {
      const clusterName = info.getValue()
      const clusterId = info.row.original.kubernetescluster?.spec?.data?.clusterId ?? ''

      return (
        <Link href={routes.app.cluster.getHref(clusterId)} className='pr-2 text-(--r-link-primary) underline'>
          {clusterName}
        </Link>
      )
    },
  }),
  columnHelper.accessor(() => 1, {
    // TODO: `1` with real health data later
    id: 'health',
    header: 'Status',
    enableSorting: false,
    cell: (info) => <HealthStatus status={info.getValue()} />,
  }),
  columnHelper.accessor((row) => row.kubernetescluster?.spec?.data?.environment ?? '', {
    header: 'Environment',
    enableSorting: false,
    cell: (info) => {
      const value = info.getValue()
      return <EnvironmentTag environment={value} />
    },
  }),
  columnHelper.accessor(
    (row) => {
      const usage = row.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.used
      return usage
    },
    {
      id: 'cpuPercentage',
      header: 'CPU',
      enableSorting: false,
      cell: (info) => {
        const usage = info.getValue()
        const cores = info.row.original.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.capacity
        return (
          <span>
            {usage} ({cores} cores)
          </span>
        )
      },
    }
  ),
  columnHelper.accessor((row) => row.kubernetescluster?.status?.state?.cluster?.resources?.memory?.used, {
    id: 'memoryPercentage',
    header: 'Memory',
    enableSorting: false,
    cell: (info) => {
      const usage = info.getValue()
      const memoryRaw = info.row.original.kubernetescluster?.status?.state?.cluster?.resources?.memory?.capacity
      return (
        <span>
          {usage} ({memoryRaw})
        </span>
      )
    },
  }),
  columnHelper.accessor(
    () => {
      // TODO: Replace with real tooling data
      const tooling = 'MOCK TOOLING'
      return tooling
    },
    {
      id: 'tooling',
      header: 'Tooling',
      enableSorting: false,
      cell: (info) => <span>{info.getValue()}</span>,
    }
  ),
  columnHelper.accessor((row) => row.kubernetescluster?.spec?.data?.project ?? '', {
    header: 'Project',
    enableSorting: false,
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.display({
    header: 'Argo',
    cell: (info) => {
      const url = info.row.original.kubernetescluster?.status?.state?.endpoints?.find(
        (e) => e.name === 'argocd'
      )?.address
      return url ? (
        <a
          href={`https://${url}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-link'
        >
          Open Argo <ExternalLink className='w-5 h-5 text-current' />
        </a>
      ) : (
        'Missing…'
      )
    },
  }),
  columnHelper.display({
    header: 'Grafana',
    cell: (info) => {
      const url = info.row.original.kubernetescluster?.status?.state?.endpoints?.find(
        (e) => e.name === 'grafana'
      )?.address
      return url ? (
        <a
          href={`https://${url}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-link'
        >
          Open Grafana <ExternalLink className='w-5 h-5 text-current' />
        </a>
      ) : (
        'Missing…'
      )
    },
  }),
] satisfies DataTableColumnDef<KubernetesCluster>[]

interface ClusterTableProps {
  data: KubernetesCluster[]
  totalCount: number
  pageCount: number
  pagination: DataTablePagination
}

export function ClustersTable({ data, totalCount, pageCount, pagination }: ClusterTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  const updateSearchParams = useCallback(
    (newSearchParams: URLSearchParams) => {
      if (newSearchParams.size > 0) {
        router.push(`${pathname}?${newSearchParams.toString()}`)
      }
    },
    [router, pathname]
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

  const handleOnSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value)
  }, [])

  /**
   * Update the search query ("?q=value") parameter based on the debounced search query
   * Reason for doing it is o ensure that the search query is updated only when the user has stopped typing for a certain amount of time.
   */
  useEffect(() => {
    function updateSearchQueryParams() {
      const params = new URLSearchParams(currentSearchParams)
      if (!debouncedSearchQuery || debouncedSearchQuery === '') {
        params.delete('q')
      } else {
        params.set('q', debouncedSearchQuery)
      }
      updateSearchParams(params)
    }
    updateSearchQueryParams()
  }, [debouncedSearchQuery, currentSearchParams, updateSearchParams])

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
      searchQuery={localSearchQuery}
      onSearchChange={handleOnSearchChange}
    />
  )
}
