'use client'

import type { DataTablePagination } from '@/components/ui/data-table'
import { DataTable } from '@/components/ui/data-table'
import type { KubernetesCluster } from '@ror/js-api-client'
import { User } from 'next-auth'
import { ClusterCardDisplayData } from '../types/display-data'
import { getClustersTableColumns } from './clusters-columns'
import { useClusterPagination } from '../hooks/use-pagination-change'

/**
 * Props for the ClusterTable component.
 *
 * @property user - The current user, if available.
 * @property data - Array of Kubernetes clusters to display in the table.
 * @property selectedDisplayData - Array of display data for selected cluster cards.
 * @property totalCount - Total number of clusters available.
 * @property pageCount - Total number of pages for pagination.
 * @property pagination - Pagination configuration for the data table.
 */
interface ClusterTableProps {
  user?: User
  data: KubernetesCluster[]
  selectedDisplayData: ClusterCardDisplayData[]
  totalCount: number
  pageCount: number
  pagination: DataTablePagination
}

/**
 * Renders a table displaying cluster data with pagination support.
 *
 * @param user - The current user object, used to determine column visibility and permissions.
 * @param data - The array of cluster data to be displayed in the table.
 * @param selectedDisplayData - Data representing the currently selected clusters for display.
 * @param totalCount - The total number of clusters available.
 * @param pageCount - The total number of pages for pagination.
 * @param pagination - The current pagination state (e.g., page number, page size).
 *
 * @returns A `DataTable` component configured to display cluster information with pagination controls.
 */
export function ClustersTable({
  user,
  data,
  selectedDisplayData,
  totalCount,
  pageCount,
  pagination,
}: ClusterTableProps) {
  const { handlePaginationChange } = useClusterPagination()

  return (
    <DataTable
      data={data}
      totalCount={totalCount}
      pageCount={pageCount}
      columns={getClustersTableColumns(user, selectedDisplayData)}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
    />
  )
}
