import { useState, useRef, useEffect, useCallback } from 'react'

interface UseInfiniteLoaderProps<T> {
  initial: T[]
  loadMore: (offset: number, limit: number) => Promise<{ items: T[]; hasMore: boolean }>
  sort?: string
  pageSize?: number
  getItemId: (item: T) => string
  getItemsKey?: (items: T[]) => string
}

/**
 * Hook for implementing infinite scrolling/loading of items.
 *
 * This hook manages a list of items, loading more as the user scrolls near the end.
 * It uses an IntersectionObserver to trigger loading when a sentinel element becomes visible.
 *
 * @template T The type of items being loaded.
 *
 * @param initial - The initial array of items.
 * @param loadMore - An async function to load more items. Receives the current offset and page size, returns an object with `items` and `hasMore`.
 * @param sort - A value indicating the current sort order; changing this resets the loader.
 * @param pageSize - The number of items to load per request. Defaults to 50.
 * @param getItemId - A function to extract a unique ID from an item. Defaults to extracting `id` property.
 * @param getItemsKey - A function to generate a key for the current items, used to reset loader when data changes.
 *
 * @returns An object containing:
 *   - `items`: The current array of loaded items.
 *   - `sentinelRef`: A ref to attach to the sentinel element for intersection observation.
 *   - `isLoading`: Whether a load operation is in progress.
 *   - `hasMore`: Whether there are more items to load.
 *   - `fetchMore`: A function to manually trigger loading more items.
 */
export function useInfiniteLoader<T>({
  initial,
  loadMore,
  sort,
  pageSize = 50,
  getItemId,
  getItemsKey = (items: T[]) => JSON.stringify(items.map(getItemId)),
}: UseInfiniteLoaderProps<T>) {
  const [items, setItems] = useState<T[]>(initial)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [consecutiveEmptyLoads, setConsecutiveEmptyLoads] = useState(0)

  // DOM sentinel. When this element becomes visible, more items are fetched automatically.
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Prevents parallel requests — ensures only one `loadMore` call runs at a time.
  const inFlightRef = useRef(false)
  // Tracks active loading session; incremented on resets to ignore stale responses.
  const runIdRef = useRef(0)
  // Stores the hash of the last known data to detect changes and reset if needed.
  const lastKeyRef = useRef(getItemsKey(initial))

  // Reset if the initial data changes (for example, new server payload or refreshed state)
  useEffect(() => {
    const nextKey = getItemsKey(initial)
    if (nextKey !== lastKeyRef.current) {
      lastKeyRef.current = nextKey
      setItems(initial)
      setHasMore(true)
      setConsecutiveEmptyLoads(0) // Reset circuit breaker
      runIdRef.current++ // invalidate in-flight requests
    }
  }, [initial, getItemsKey])

  // Reset when the sorting order changes
  useEffect(() => {
    console.log(`[useInfiniteLoader] Sort changed to: ${sort}, resetting hasMore and runId`)
    setItems(initial) // Reset to initial items when sort changes
    setHasMore(true)
    setConsecutiveEmptyLoads(0) // Reset circuit breaker
    runIdRef.current++ // invalidate previous fetches
  }, [sort, initial])

  // Fetch more items (manually or triggered by scroll)
  const fetchMore = useCallback(async () => {
    // Skip if already fetching or no more items left
    if (inFlightRef.current || isLoading || !hasMore) return
    inFlightRef.current = true
    setIsLoading(true)

    const runId = runIdRef.current
    try {
      // Load more data from backend
      const data = await loadMore(items.length, pageSize)

      // Ignore outdated responses (e.g., sort changed mid-fetch)
      if (runId !== runIdRef.current) return

      // Merge new items while preventing duplicates
      setItems((prev) => {
        const seen = new Set(prev.map(getItemId))
        const incoming = data.items.filter((item) => !seen.has(getItemId(item)))
        console.log(
          `[useInfiniteLoader] Adding ${incoming.length} new items (filtered ${data.items.length - incoming.length} duplicates)`
        )

        // Circuit breaker: if we get no new items multiple times, stop loading
        if (incoming.length === 0) {
          setConsecutiveEmptyLoads((prev) => {
            const newCount = prev + 1
            console.log(`[useInfiniteLoader] No new items added, consecutive empty loads: ${newCount}`)

            // If we get all duplicates on the first failed load, it suggests API pagination issues
            if (newCount === 1 && data.items.length > 0) {
              console.log(
                `[useInfiniteLoader] ⚠️  API returned ${data.items.length} items but all were duplicates - API pagination may not be working properly`
              )
            }

            if (newCount >= 2) {
              // Reduced from 3 to 2 for faster detection
              console.log(`[useInfiniteLoader] Circuit breaker triggered - stopping infinite loading`)
              console.log(
                `[useInfiniteLoader] This usually means the API doesn't support pagination or is returning duplicate data`
              )
              setHasMore(false)
            }
            return newCount
          })
        } else {
          setConsecutiveEmptyLoads(0) // Reset counter when we successfully add items
        }

        return incoming.length ? [...prev, ...incoming] : prev
      })

      // Mark as complete if no additional data remains
      if (!data.hasMore) setHasMore(false)
    } finally {
      // Only end loading if this request is the latest one
      if (runId === runIdRef.current) {
        setIsLoading(false)
        inFlightRef.current = false
      }
    }
  }, [items, pageSize, loadMore, hasMore, isLoading, getItemId])

  // Automatically trigger fetchMore() when sentinel enters the viewport
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !isLoading && hasMore) {
          fetchMore()
        }
      },
      {
        root: null, // uses viewport
        rootMargin: '600px', // prefetch early while scrolling
        threshold: 0,
      }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [fetchMore, isLoading, hasMore])

  return { items, sentinelRef, isLoading, hasMore, fetchMore }
}
