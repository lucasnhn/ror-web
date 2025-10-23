/*
 * FILE OVERVIEW:
 *
 * Custom hook for filtering items based on selected filter criteria.
 */

import { useState, useMemo, useCallback } from 'react'

/**
 * Represents a definition for extracting a filter value from an item.
 *
 * @template T - The type of item from which the filter value is extracted.
 * @property {string} key - The unique key identifying the filter.
 * @property {(item: T) => string | null | undefined} extractor - A function that extracts the filter value from an item.
 */
interface FilterDefinition<T> {
  key: string
  extractor: (item: T) => string | null | undefined
}

/**
 * Custom React hook for filtering a list of items based on multiple filter definitions.
 *
 * @template T - The type of items to be filtered.
 * @param items - The array of items to filter.
 * @param filters - An array of filter definitions, each containing a key and an extractor function.
 * @returns An object containing:
 *   - `selectedFilters`: The current selected filter values, keyed by filter key.
 *   - `setSelectedFilters`: Setter function to update selected filters.
 *   - `filteredItems`: The filtered array of items based on selected filters.
 *   - `resetFilters`: Function to reset all selected filters.
 */
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
