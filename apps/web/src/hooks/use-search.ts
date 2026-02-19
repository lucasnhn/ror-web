import { useMemo, useState, useEffect, useTransition } from 'react'
import Fuse, { FuseOptionKey } from 'fuse.js'

export interface UseSearchOptions<T, M = T> {
  threshold?: number
  keys?: FuseOptionKey<M>[]
  mapItem?: (item: T) => M
}

export function useSearch<T, M = T>(items: T[], query: string, options: UseSearchOptions<T, M> = {}) {
  const { threshold = 0.3, keys = [], mapItem } = options

  const [results, setResults] = useState<T[]>(items)
  const [isPending, startTransition] = useTransition()

  const { fuse, sourceItems } = useMemo(() => {
    const sourceItems = mapItem
      ? items.map((item) => ({ original: item, mapped: mapItem(item) }))
      : items.map((i) => ({ original: i, mapped: i as unknown as M }))

    const fuse = new Fuse<M>(
      sourceItems.map((i) => i.mapped),
      {
        keys,
        threshold,
        useExtendedSearch: true,
        ignoreLocation: true,
      }
    )

    return { fuse, sourceItems }
  }, [items, keys, threshold, mapItem])

  useEffect(() => {
    if (!query.trim()) {
      setResults(items)
      return
    }

    startTransition(() => {
      const formattedQuery = query.includes('-') || query.includes('_') ? `=${query.trim()}` : query.trim()

      const searchResults = fuse.search(formattedQuery)
      const mapped = searchResults.map((r) => sourceItems[r.refIndex].original)

      setResults(mapped)
    })
  }, [query, fuse, sourceItems, items])

  return { results, isSearching: isPending }
}
