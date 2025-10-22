import { useMemo } from 'react'
import Fuse from 'fuse.js'

export interface UseSearchOptions<T> {
  threshold?: number
  keys?: Fuse.FuseOptionKey<T>[]
  /**
   * A function that transforms raw items into flat searchable objects.
   * Useful for nested data structures.
   */
  mapItem?: (item: T) => Record<string, any>
}

/**
 * Generic hook for fuzzy searching any dataset with Fuse.js.
 *
 * @param items - The array of items to search.
 * @param query - Search string.
 * @param options - Configuration for Fuse and optional item mapper.
 * @returns Filtered array of matching items.
 */
export function useSearch<T>(items: T[], query: string, options: UseSearchOptions<T> = {}): T[] {
  const { threshold = 0.3, keys = [], mapItem } = options

  const { fuse, sourceItems } = useMemo(() => {
    const sourceItems = mapItem
      ? items.map((item, i) => ({ original: item, mapped: mapItem(item) }))
      : items.map((i) => ({ original: i, mapped: i }))
    const fuse = new Fuse(
      sourceItems.map((i) => i.mapped),
      { keys, threshold }
    )
    return { fuse, sourceItems }
  }, [items, keys, threshold, mapItem])

  if (!query.trim()) return items
  const results = fuse.search(query.trim())
  return results.map((r) => sourceItems[r.refIndex].original)
}
