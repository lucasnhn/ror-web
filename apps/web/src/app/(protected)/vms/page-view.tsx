/**
 * VMs Page View Component
 * FILE OVERVIEW:
 * ------------------------
 * Renders the main content of the Virtual Machines (VMs) page, including controls for searching, filtering, sorting, and toggling between grid and list views.
 * It also manages the state for selected display data, filters, and search results.
 *
 * Key Features:
 * - Search functionality to filter VMs based on user input.
 * - Multi-select dropdowns for choosing which VM attributes to display and for filtering VMs by specific criteria.
 * - Sorting options to order VMs by various attributes in ascending or descending order.
 * - Toggle switch to open/close the filter section.
 * - View switcher to toggle between grid and list views of VMs.
 * - Pagination support for navigating through large sets of VMs in list view.
 *
 * The component uses React hooks for state management and side effects, and it leverages Next.js navigation features for URL management.
 */

'use client'

import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { PageViewProps, VirtualMachine } from '@/features/vms/utils/vms'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { cn } from '@/utils/clsxm'
import { useRef, useState, useMemo, useEffect } from 'react'
import { VMCard } from '@/features/vms/components/vm-card'
import { VMCardData } from '@/features/vms/types/vm-card-type'
import { VMTable } from './vms-table'
import { displayDataOptions, sortingOptions, filterOptions } from '@/features/vms/config/page-view-options'
import { useDisplayData } from '@/hooks/use-display-data'
import { ResourceControls } from '@/components/ui/resource-controls'
import { exportVmsAsCSV, exportVmsAsExcel } from '@/features/vms/utils/export-helpers'
import { buildSortParams, buildToggledParams } from '@/utils/url-helpers'
import { usePathname, useRouter } from 'next/navigation'
import { useFilters } from '@/hooks/use-filters'
import { SortDefinition, useSorting } from '@/hooks/use-sorting'

export const PageView = ({ className, user, vms, params }: PageViewProps) => {
  const filtersOpen = params.filters === 'open'

  const sentinelRef = useRef<HTMLDivElement>(null)

  const safeItems = useMemo(
    () =>
      vms.filter(
        (c) =>
          c.virtualmachine?.status?.operatingsystem && typeof c.virtualmachine?.status?.operatingsystem === 'object'
      ),
    [vms]
  )

  const filterDefinitions = [
    { key: 'Power States', extractor: (vm: VirtualMachine) => vm.virtualmachine?.status?.operatingsystem?.powerstate },
  ]

  const { selectedFilters, setSelectedFilters, filteredItems, resetFilters } = useFilters<VirtualMachine>(
    safeItems,
    filterDefinitions
  )
  const { selectedDisplayData, setSelectedDisplayData } = useDisplayData<VMCardData>('vms')
  const [searchResults, setSearchResults] = useState<VirtualMachine[]>(safeItems)

  // Handler for display data changes
  const onDisplayChange = (selected: Option[]) => setSelectedDisplayData(selected.map((i) => i.value as VMCardData))

  // sync safeItems → searchResults only if content differs
  const idOf = (c: VirtualMachine) => c.virtualmachine?.status?.operatingsystem?.id || ''
  const idsKey = (arr: VirtualMachine[]) => arr.map(idOf).join('|')
  const lastSafeKeyRef = useRef('')
  useEffect(() => {
    const nextKey = idsKey(safeItems)
    if (nextKey !== lastSafeKeyRef.current) {
      lastSafeKeyRef.current = nextKey
    }
  }, [safeItems])

  const pathname = usePathname()
  const router = useRouter()
  const clearUrl = () => router.replace(pathname, { scroll: false })

  const handleRefreshFilters = () => {
    resetFilters()
    setSelectedDisplayData([])
    clearUrl()
  }

  // ---------- Toggle/Sort params ----------
  const { url: toggleParams } = buildToggledParams(params, 'filters', 'open', 'vms')
  const toggleSortParams = buildSortParams(params, 'vms')

  // ---------- Sorting ----------

  const sortDefinitions: SortDefinition<VirtualMachine>[] = [
    {
      key: 'hostname',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.hostname,
    },
    {
      key: 'name',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.name,
    },
    {
      key: 'id',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.id,
    },
    {
      key: 'family',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.family,
    },
    {
      key: 'architecture',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.architecture,
    },
    {
      key: 'version',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.version,
    },
    {
      key: 'toolversion',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.toolversion,
    },
    {
      key: 'powerstate',
      extractor: (vm) => vm.virtualmachine?.status?.operatingsystem?.powerstate,
    },
  ]

  const sortedItems = useSorting({
    items: filteredItems,
    sortKey: params.sort,
    sortOrder: params.order,
    definitions: sortDefinitions,
  })

  const displayedItems = useMemo(() => {
    const base = params.sort ? sortedItems : filteredItems
    if (!searchResults?.length) return base
    const ids = new Set(searchResults.map(idOf))
    return base.filter((c) => ids.has(idOf(c)))
  }, [sortedItems, filteredItems, searchResults, params.sort])

  const renderControls = () => (
    <div className='flex flex-wrap items-center justify-between w-full gap-4 [@container(max-width:1000px)]:flex-col [@container(max-width:1000px)]:items-start [@container(max-width:1000px)]:gap-6'>
      <ResourceControls
        safeItems={safeItems}
        searchText='Find VMs...'
        selectedDisplayData={selectedDisplayData}
        onDisplayChange={onDisplayChange}
        onSearchResultsChange={setSearchResults}
        displayDataOptions={displayDataOptions}
        params={params}
        toggleSortParams={toggleSortParams}
        filtersOpen={filtersOpen}
        toggleParams={toggleParams}
        handleRefreshFilters={handleRefreshFilters}
        domain='vms'
        sortingOptions={sortingOptions}
        searchKeys={['label', 'hostname', 'powerState', 'family']}
        mapItem={(vm) => ({
          ...vm,
          label: vm.metadata?.name ?? vm.virtualmachine?.spec?.name,
          hostname: vm.virtualmachine?.status?.operatingsystem?.hostname,
          powerState: vm.virtualmachine?.status?.operatingsystem?.powerstate,
          family: vm.virtualmachine?.status?.operatingsystem?.family,
        })}
        getItemsKey={idsKey}
        exportAsCSV={exportVmsAsCSV}
        exportAsExcel={exportVmsAsExcel}
      />
    </div>
  )

  const renderFilterSection = () =>
    filtersOpen && (
      <div className='flex flex-wrap items-center gap-x-4 gap-y-6 min-h-28 mx-12 mt-6'>
        {filterOptions.map((option) => (
          <MultipleSelector
            key={option.label}
            className='w-52'
            commandProps={{ label: option.label }}
            value={(selectedFilters[option.label] || []).map((v) => ({ value: v, label: v }))}
            onChange={(selectedOptions) => {
              const next = selectedOptions.map((opt) => opt.value)
              setSelectedFilters((prev) => {
                const curr = prev[option.label] || []
                const same = curr.length === next.length && curr.every((v, i) => v === next[i])
                if (same) return prev
                return { ...prev, [option.label]: next }
              })
            }}
            defaultOptions={option.data}
            placeholder={option.placeholder}
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className='text-center text-sm'>No results found</p>}
          />
        ))}
      </div>
    )

  return (
    <div className={cn(className, '@container')}>
      <div className={cn('border-b', filtersOpen && 'pb-2')}>
        <div className={cn('mx-12 flex items-center min-h-28 py-6 ', filtersOpen && 'w-[calc(100%-6rem)] border-b')}>
          {renderControls()}
        </div>
        {renderFilterSection()}
      </div>

      <NotReadyMessage className='mx-12 my-6'>
        Welcome to the new ROR web! This site is currently under development, so feel free to look around, but do not
        expect finished functionality or that all data is present. The development team is working hard on delivering a
        complete product as quick as possible :)
      </NotReadyMessage>

      <section className='px-12 my-8'>
        {params.view === 'list' ? (
          <VMTable
            key='table'
            user={user}
            vms={(params.sort ? sortedItems : filteredItems).filter((c) =>
              searchResults.some(
                (sr) =>
                  sr.virtualmachine?.status?.operatingsystem?.id === c.virtualmachine?.status?.operatingsystem?.id ||
                  sr.virtualmachine?.status?.operatingsystem?.name ===
                    c.virtualmachine?.status?.operatingsystem?.name ||
                  sr.virtualmachine?.status?.operatingsystem?.hostname ===
                    c.virtualmachine?.status?.operatingsystem?.hostname
              )
            )}
            selectedDisplayData={selectedDisplayData}
          />
        ) : (
          <div className='flex flex-row flex-wrap gap-6'>
            {displayedItems.map((vm, idx) => (
              <div key={idOf(vm) || idx}>
                <VMCard
                  user={user}
                  vm={vm}
                  vmDisplayData={
                    selectedDisplayData.length > 0
                      ? selectedDisplayData
                      : displayDataOptions.map((opt) => opt.value as VMCardData)
                  }
                />
              </div>
            ))}
            <div ref={sentinelRef} className='h-px' />
          </div>
        )}
      </section>
    </div>
  )
}
export default PageView
