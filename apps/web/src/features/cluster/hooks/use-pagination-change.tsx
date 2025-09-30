import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { DataTablePagination } from '@/components/ui/data-table'

/**
 * This hook provides a `handlePaginationChange` callback that updates the current
 * page and page size in the URL query parameters, enabling pagination state to be
 * reflected in the browser's address bar and navigable via router.
 *
 * @returns An object containing the `handlePaginationChange` function.
 */
export function useClusterPagination() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePaginationChange = useCallback(
    (state: DataTablePagination) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', (state.pageIndex + 1).toString())
      params.set('limit', state.pageSize.toString())
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return { handlePaginationChange }
}
