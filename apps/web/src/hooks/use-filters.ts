import { useState, useMemo, useCallback } from 'react'

interface FilterDefinition<T> {
  key: string
  extractor: (item: T) => string | null | undefined
}

export function useFilters<T>(items: T[], filters: FilterDefinition<T>[]) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      filters.every(({ key, extractor }) => {
        const filterValues = selectedFilters[key]
        if (!filterValues?.length) return true
        const value = extractor(item)
        return value && filterValues.includes(value)
      })
    )
  }, [items, selectedFilters, filters])

  const resetFilters = useCallback(() => setSelectedFilters({}), [])

  return { selectedFilters, setSelectedFilters, filteredItems, resetFilters }
}
