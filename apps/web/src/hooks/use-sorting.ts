import { SortOrder } from '@/types/resources-page'
import { useMemo } from 'react'

export interface SortDefinition<T> {
  key: string
  extractor: (item: T) => string | number | null | undefined
}

export function useSorting<T>({
  items,
  sortKey,
  sortOrder = 'asc',
  definitions,
}: {
  items: T[]
  sortKey?: string
  sortOrder?: SortOrder
  definitions: SortDefinition<T>[]
}) {
  return useMemo(() => {
    if (!sortKey) return items

    const def = definitions.find((d) => d.key === sortKey)
    if (!def) return items

    const { extractor } = def
    const orderMultiplier = sortOrder === 'desc' ? -1 : 1

    return [...items].sort((a, b) => {
      const aVal = extractor(a)
      const bVal = extractor(b)

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      // Numeric compare
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * orderMultiplier

      // String compare
      return String(aVal).localeCompare(String(bVal)) * orderMultiplier
    })
  }, [items, sortKey, sortOrder, definitions])
}
