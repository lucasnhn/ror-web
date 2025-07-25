import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { DataTablePagination } from './data-table'

interface UseDataTable {
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
  const handleOnPaginationChange = useCallback(
    (state: DataTablePagination) => {
      const params = new URLSearchParams(currentSearchParams)
      params.set('page', (state.pageIndex + 1).toString())
      params.set('limit', state.pageSize.toString())
      updateSearchParams(params)
    },
    [currentSearchParams, updateSearchParams]
  )

  return {
    onPaginationChange: handleOnPaginationChange,
  }
}
