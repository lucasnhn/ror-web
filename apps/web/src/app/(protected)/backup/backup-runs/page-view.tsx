'use client'

import {
  getBackupRunEndTime,
  getBackupRunExpiryTime,
  getBackupRunId,
  getBackupRunKey,
  getBackupRunMappedBackupJobId,
  getBackupRunSource,
  getBackupRunStartTime,
  PageViewProps,
} from '@/features/vms/backup/utils/backup-run'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useDisplayData } from '@/hooks/use-display-data'
import { useFilters } from '@/hooks/use-filters'
import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { SortDefinition, useSorting } from '@/hooks/use-sorting'
import { loadMoreBackupRuns } from '@/utils/backup-run-actions'
import { BackupRun } from '@ror/js-api-client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { RotateCw, Search } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { SortSelect } from '@/components/ui/sort-select'
import { sortingOptionsBackupRun } from '@/features/backup/config/page-view-options'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/ui/data-table'
import { getBackupRunTableColumns } from '@/features/backup/backup-run/components/backup-run-columns'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { cn } from '@/utils/clsxm'
import { BackupRunColumnsData } from '@/features/backup/backup-run/types/backup-run-types'

export const PageView = ({ className, backupRuns, params, backupJobId }: PageViewProps) => {
  const filtersOpen = params.filters === 'open'

  const { items, sentinelRef, isLoading, hasMore } = useInfiniteLoader<BackupRun>({
    initial: backupRuns,
    sort: params.sort,
    pageSize: 50,
    getItemId: getBackupRunId,
    getItemsKey: getBackupRunKey,
    loadMore: async (offset, limit) => {
      const res = await loadMoreBackupRuns({
        offset,
        limit,
        sort: params.sort,
        order: params.order,
      })
      return { items: res.items ?? [], hasMore: res.hasMore }
    },
  })

  const safeItems = useMemo(() => items.filter((c) => getBackupRunId(c)), [items])

  const filterDefinitions = [{ key: 'source', extractor: (backupRun: BackupRun) => getBackupRunSource(backupRun) }]
  const definitions: SortDefinition<BackupRun>[] = [
    { key: 'source', extractor: (item) => getBackupRunSource(item) },
    { key: 'startTime', extractor: (item) => getBackupRunStartTime(item) },
    { key: 'endTime', extractor: (item) => getBackupRunEndTime(item) },
    { key: 'expiryTime', extractor: (item) => getBackupRunExpiryTime(item) },
    { key: 'backupJobId', extractor: (item) => getBackupRunMappedBackupJobId(item) },
  ]

  const { filteredItems, resetFilters } = useFilters<BackupRun>(safeItems, filterDefinitions)
  const { setSelectedDisplayData } = useDisplayData<BackupRunColumnsData>('backup-runs')
  const [searchResults, setSearchResults] = useState<BackupRun[]>(safeItems)
  // Initialize search query from backupJobId parameter
  const [searchQuery, setSearchQuery] = useState(backupJobId || '')
  const debouncedQuery = useDebouncedValue(searchQuery, 120)
  const sortedItems = useSorting({ items: filteredItems, sortKey: params.sort, sortOrder: params.order, definitions })

  // Custom search handler for exact ID matching
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults(safeItems)
      return
    }

    const trimmedQuery = debouncedQuery.trim()

    const exactIdMatch = safeItems.filter(
      (item) => getBackupRunId(item) === trimmedQuery || getBackupRunMappedBackupJobId(item) === trimmedQuery
    )

    if (exactIdMatch.length > 0) {
      setSearchResults(exactIdMatch)
      return
    }

    // If no exact ID match, do fuzzy search directly here
    const fuzzyMatches = safeItems.filter((item) => {
      const id = getBackupRunId(item).toLowerCase()
      const source = getBackupRunSource(item).toLowerCase()
      const queryLower = trimmedQuery.toLowerCase()

      return id.includes(queryLower) || source.includes(queryLower)
    })

    setSearchResults(fuzzyMatches)
  }, [debouncedQuery, safeItems])

  const lastSafeKeyRef = useRef('')
  useEffect(() => {
    const nextKey = getBackupRunKey(safeItems)
    if (nextKey !== lastSafeKeyRef.current) {
      lastSafeKeyRef.current = nextKey
      if (!debouncedQuery.trim()) {
        setSearchResults(safeItems)
      }
    }
  }, [safeItems, debouncedQuery])

  const pathname = usePathname()
  const router = useRouter()
  const clearUrl = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [pathname, router])

  const handleRefreshFilters = useCallback(() => {
    resetFilters()
    setSelectedDisplayData([])
    clearUrl()
  }, [resetFilters, setSelectedDisplayData, clearUrl])

  const displayedItems = useMemo(() => {
    if (!searchResults.length) return safeItems
    const ids = new Set(searchResults.map(getBackupRunId))
    return sortedItems.filter((c) => ids.has(getBackupRunId(c)))
  }, [searchResults, sortedItems])

  const renderControls = () => (
    <div className='flex flex-wrap items-center justify-between w-full gap-4 [@container(max-width:1000px)]:flex-col [@container(max-width:1000px)]:items-start [@container(max-width:1000px)]:gap-6'>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-6'>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search backup runs...'
          aria-label='Search backup runs...'
          icon={<Search className='w-4 h-4' />}
          iconPosition='left'
        />
        <SortSelect options={sortingOptionsBackupRun} currentSort={params.sort} />
        <Button
          type='button'
          onClick={handleRefreshFilters}
          aria-label='Reset filters'
          title='Reset filters'
          className='gap-2'
        >
          <RotateCw className='h-4 w-4' />
          Refresh
        </Button>
      </div>
    </div>
  )

  const TableView = () => {
    return (
      <div>
        <DataTable
          data={displayedItems}
          columns={getBackupRunTableColumns()}
          hasMore={hasMore}
          isLoading={isLoading}
          sentinelRef={sentinelRef}
        />
      </div>
    )
  }

  return (
    <div className={cn(className, '@container')}>
      <div className={cn('border-b', filtersOpen && 'pb-2')}>
        <div className={cn('mx-12 flex items-center min-h-28 py-6 ', filtersOpen && 'w-[calc(100%-6rem)] border-b')}>
          {renderControls()}
        </div>
      </div>
      <NotReadyMessage className='mx-12 my-6'>
        Welcome to the new ROR web! This site is currently under development, so feel free to look around, but do not
        expect finished functionality or that all data is present. The development team is working hard on delivering a
        complete product as quick as possible :)
      </NotReadyMessage>

      <section className='px-12 my-8'>
        <TableView />
      </section>
    </div>
  )
}

export default PageView
