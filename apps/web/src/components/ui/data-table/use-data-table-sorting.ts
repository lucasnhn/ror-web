import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { DataTablePagination, DataTableSorting } from './data-table'

interface UseDataTable {
  sortingState: DataTableSorting
  onSortChange: (state: DataTableSorting) => void
  onPaginationChange: (state: DataTablePagination) => void
}

/**
 * useDataTable
 * * A custom hook for managing data table sorting & pagination state with URL search params.
 *
 * This hook provides functionality to:
 * - Handle pagination changes by updating URL search params
 * - Handle sorting changes by updating URL search params
 * - Parse current URL search params for initial state
 *
 * @returns Object containing handlers and current state for data table
 */
export function useDataTable(): UseDataTable {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  /**
   * Push updated url with the new search params
   */
  const updateSearchParams = useCallback(
    (newSearchParams: URLSearchParams) => {
      if (newSearchParams.size > 0) {
        router.push(`${pathname}?${newSearchParams.toString()}`)
      }
    },
    [router, pathname]
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

  const handleOnPaginationChange = useCallback(
    (state: DataTablePagination) => {
      const params = new URLSearchParams(currentSearchParams)
      params.set('page', (state.pageIndex + 1).toString())
      params.set('limit', state.pageSize.toString())
      updateSearchParams(params)
    },
    [currentSearchParams, updateSearchParams]
  )

  const sortByField = currentSearchParams.get('sort')
  const sortDirection = currentSearchParams.get('order')

  const sortingState: DataTableSorting = sortByField
    ? [
        {
          id: sortByField,
          desc: sortDirection === 'desc',
        },
      ]
    : []

  return {
    sortingState,
    onSortChange: handleOnSortChange,
    onPaginationChange: handleOnPaginationChange,
  }
}
