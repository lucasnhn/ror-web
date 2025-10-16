/**
 * Cluster Management Component
 *
 * FILE OVERVIEW
 * ----------------------
 * This file defines the main React component (`PageView`) responsible for displaying and managing Kubernetes clusters
 * in the ROR web application.
 *
 * Architecture:
 * - Logic is split into dedicated hooks:
 *   • useInfiniteClusters — handles incremental loading and scroll detection
 *   • useClusterFilters — manages filter state and derived filtered data
 *   • useClusterSorting — applies dynamic sorting logic
 *   • useDisplayData — controls which cluster fields are shown in the UI
 *
 * - Layout Components:
 *   • <ClusterControls /> — top toolbar for search, sort, export, and view toggling
 *   • <ClusterFilterSection /> — collapsible filter selection area
 *   • <ClustersTable /> / <ClusterCard /> — list and grid cluster displays
 *
 * Developer Notes:
 * - URL helpers (`buildToggledParams`, `buildSortParams`) standardize query parameter management
 * - All cluster-related UI logic is centralized in this component for maintainability
 */

'use client'
import { Option } from '@/components/shadcn/multiselect'
import { DataTable } from '@/components/ui/data-table'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { ClusterCard } from '@/features/cluster/components/cluster-card'
import { ClusterControls } from '@/features/cluster/components/cluster-controls'
import { ClusterFilterSection } from '@/features/cluster/components/cluster-filter-section'
import { displayDataOptions } from '@/features/cluster/config/page-view-options'
import { useClusterFilters } from '@/features/cluster/hooks/use-cluster-filters'
import { useClusterSorting } from '@/features/cluster/hooks/use-cluster-sorting'
import { useDisplayData } from '@/features/cluster/hooks/use-display-data'
import { ClusterCardDisplayData } from '@/features/cluster/types/display-data'
import { getClusterId, getClustersKey } from '@/features/cluster/utils/cluster'
import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { cn } from '@/utils/clsxm'
import { loadMoreClusters } from '@/utils/cluster-actions'
import { buildSortParams, buildToggledParams } from '@/utils/url-helpers'
import type { KubernetesCluster } from '@ror/js-api-client'
import { User } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getClustersTableColumns } from '@/features/cluster/components/clusters-columns'

/**
 * Represents the query parameters for the clusters page view.
 *
 * @property view - The display mode of the clusters, either 'grid' or 'list'.
 * @property page - The current page number for pagination.
 * @property limit - The maximum number of items per page.
 * @property sort - The field by which to sort the clusters.
 * @property order - The sort direction, either 'asc' (ascending) or 'desc' (descending).
 * @property filters - A string representing applied filters.
 */
interface Params {
  view?: 'grid' | 'list'
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: string
}

/**
 * Props for the PageView component.
 *
 * @property {string} [className] - Optional CSS class name for styling the component.
 * @property {User} user - The current user viewing the page.
 * @property {KubernetesCluster[]} clusters - List of Kubernetes clusters to display.
 * @property {Params} params - Route or query parameters relevant to the page view.
 */
interface PageViewProps {
  className?: string
  user: User
  clusters: KubernetesCluster[]
  params: Params
}

/**
 * Renders the main page view for displaying clusters in either grid or table format.
 *
 * Handles cluster data loading, filtering, sorting, searching, and display options.
 * Supports lazy loading of clusters, filter controls, and display customization.
 * Pagination logic is present but marked for removal in favor of lazy loading (see issue #350).
 *
 * @param className - Optional CSS class for the root container.
 * @param user - The current user object, used for permission and display logic.
 * @param clusters - Initial list of clusters to display.
 * @param params - URL/query parameters controlling view, sorting, filtering, pagination, etc.
 *
 * @returns The rendered cluster page view, including controls, filters, and either a grid or table of clusters.
 */
export const PageView = ({ className, user, clusters, params }: PageViewProps) => {
  // Router and pathname
  const router = useRouter()
  const pathname = usePathname()

  // Filter state
  const filtersOpen = params.filters === 'open'

  // Infinite loading of clusters
  const { items, sentinelRef, isLoading, hasMore } = useInfiniteLoader<KubernetesCluster>({
    initial: clusters,
    sort: params.sort,
    pageSize: 50,
    getItemId: getClusterId,
    getItemsKey: getClustersKey,
    loadMore: async (offset, limit) => {
      const res = await loadMoreClusters({ offset, limit, sort: params.sort })
      return { items: res.items ?? [], hasMore: res.hasMore }
    },
  })

  // Clusters valid after filtering and searching
  const safeItems = useMemo(
    () => items.filter((c) => c.kubernetescluster?.spec?.data && typeof c.kubernetescluster.spec.data === 'object'),
    [items]
  )

  // Cluster filters, display data and search result
  const { selectedFilters, setSelectedFilters, filteredItems, resetFilters } = useClusterFilters(safeItems)
  const { selectedDisplayData, setSelectedDisplayData } = useDisplayData()
  const [searchResults, setSearchResults] = useState<KubernetesCluster[]>(safeItems)

  // Handler for display data changes
  const onDisplayChange = (selected: Option[]) =>
    setSelectedDisplayData(selected.map((i) => i.value as ClusterCardDisplayData))

  // Sync safeItems -> searchResults only if content differs
  const lastSafeKeyRef = useRef('')
  useEffect(() => {
    const nextKey = getClustersKey(safeItems)
    if (nextKey !== lastSafeKeyRef.current) {
      lastSafeKeyRef.current = nextKey
      setSearchResults((prev) => {
        const prevKey = getClustersKey(prev)
        const isSearching = prev.length !== safeItems.length
        return isSearching || prevKey === nextKey ? prev : safeItems
      })
    }
  }, [safeItems])

  // Handle refresh (reset filters + display data + url)
  const clearUrl = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [router, pathname])

  const handleRefreshFilters = useCallback(() => {
    resetFilters()
    setSelectedDisplayData([])
    clearUrl()
  }, [resetFilters, setSelectedDisplayData, clearUrl])

  // Toggle/Sort params
  const toggleParams = useMemo(
    () =>
      buildToggledParams(
        params as Record<string, string | number | boolean | null | undefined>,
        'filters',
        'open',
        'clusters'
      ).url,
    [params]
  )

  const toggleSortParams = useMemo(
    () => buildSortParams(params as Record<string, string | number | boolean | null | undefined>, 'clusters'),
    [params]
  )

  // Sorting
  const sortedItems = useClusterSorting({ clusters: filteredItems, sort: params.sort, order: params.order })

  const displayedItems = useMemo(() => {
    if (!searchResults?.length) return sortedItems
    const ids = new Set(searchResults.map(getClusterId))
    return sortedItems.filter((c) => ids.has(getClusterId(c)))
  }, [sortedItems, searchResults])

  // Grid and table view
  const GridView = () => {
    return (
      <div>
        <div className='flex flex-row flex-wrap gap-6'>
          {displayedItems.map((cluster, idx) => (
            <div key={getClusterId(cluster) || idx}>
              <ClusterCard
                user={user}
                cluster={cluster}
                displayData={
                  selectedDisplayData?.length > 0
                    ? selectedDisplayData
                    : displayDataOptions?.map((o) => o.value as ClusterCardDisplayData) || []
                }
              />
            </div>
          ))}
          <div ref={sentinelRef} className='h-px' />
        </div>
        {isLoading && <div style={{ textAlign: 'center', padding: 16 }}>Loading...</div>}
        {!hasMore && <div style={{ textAlign: 'center', padding: 16, color: '#888' }}>All clusters are loaded.</div>}
      </div>
    )
  }

  const TableView = () => {
    return (
      <DataTable
        data={displayedItems}
        columns={getClustersTableColumns(clusters, user, selectedDisplayData)}
        hasMore={hasMore}
        isLoading={isLoading}
        sentinelRef={sentinelRef}
      />
    )
  }

  return (
    <div className={cn(className, '@container')}>
      <div className={cn('border-b', filtersOpen && 'pb-2')}>
        <div className={cn('mx-12 flex items-center min-h-28 py-6 ', filtersOpen && 'w-[calc(100%-6rem)] border-b')}>
          <ClusterControls
            safeItems={safeItems}
            selectedDisplayData={selectedDisplayData}
            onDisplayChange={onDisplayChange}
            onSearchResultsChange={setSearchResults}
            handleRefreshFilters={handleRefreshFilters}
            toggleParams={toggleParams}
            toggleSortParams={toggleSortParams}
            filtersOpen={filtersOpen}
            params={params}
          />
        </div>

        <ClusterFilterSection
          filtersOpen={filtersOpen}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>

      <NotReadyMessage className='mx-12 my-6'>
        Welcome to the new ROR web! This site is currently under development, so feel free to look around, but do not
        expect finished functionality or that all data is present. The development team is working hard on delivering a
        complete product as quick as possible :)
      </NotReadyMessage>

      <section className='px-12 my-8'>{params.view === 'list' ? <TableView /> : <GridView />}</section>
    </div>
  )
}
