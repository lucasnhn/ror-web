'use client'

import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { PageViewProps, VirtualMachine } from './interfaces'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { cn } from '@/utils/clsxm'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { VMCard, VMCardData } from '@/components/ui/vm/vm-card'
import { VMTable } from './vms-table'
import { Toggle } from '@/components/shadcn/toggle'
import Link from 'next/link'
import { Button } from '@/components/shadcn/button'
import { TabsViewSwitcher } from '@/components/ui/tabs-view-switcher'
import { ArrowDownNarrowWide, ArrowDownWideNarrow, Funnel, RotateCw } from 'lucide-react'
import { SortSelect } from '@/components/ui/sort-select'
import { se } from 'date-fns/locale'
import { VmSearch } from '@/components/ui/vm/vm-search'

const displayDataOptions: Option[] = [
  { label: 'Hostname', value: 'os_hostName' },
  { label: 'Name', value: 'os_name' },
  { label: 'ID', value: 'os_id' },
  { label: 'Power State', value: 'powerState' },
  { label: 'Architecture', value: 'os_architecture' },
  { label: 'Family', value: 'os_family' },
  { label: 'Version', value: 'os_version' },
  { label: 'Tool Version', value: 'os_toolVersion' },
]

const sortingOptions = [
  { value: 'hostname', label: 'Hostname' },
  { value: 'name', label: 'Name' },
  { value: 'id', label: 'ID' },
  { value: 'powerstate', label: 'Power State' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'family', label: 'Family' },
  { value: 'version', label: 'Version' },
  { value: 'toolVersion', label: 'Tool Version' },
]

const powerStateOptions: Option[] = [
  { value: 'poweredOn', label: 'Powered On' },
  { value: 'poweredOff', label: 'Powered Off' },
  { value: 'undefined', label: 'Undefined' },
]

const filterOptions = [
  { label: 'Power States', placeholder: 'Choose Power State', data: powerStateOptions },
  { label: 'More filters', placeholder: 'Mote filters here', data: [] },
]

export const PageView = ({ className, user, vms, params }: PageViewProps) => {
  const DEFAULT_LIMIT = 3
  const DEFAULT_PAGE = 1

  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE
  const filtersOpen = params.filters === 'open'
  const pathname = usePathname()

  const sentinelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const idOf = (c: VirtualMachine) => c.virtualmachine?.status?.operatingsystem?.id || ''

  const idsKey = (arr: VirtualMachine[]) => arr.map(idOf).join('|')

  const safeItems = useMemo(
    () =>
      vms.filter(
        (c) =>
          c.virtualmachine?.status?.operatingsystem && typeof c.virtualmachine?.status?.operatingsystem === 'object'
      ),
    [vms]
  )
  const [selectedDisplayData, setSelectedDisplayData] = useState<VMCardData[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchResults, setSearchResults] = useState<VirtualMachine[]>(safeItems)

  const onSearchResultsChange = useCallback((res: VirtualMachine[]) => {
    setSearchResults((prev) => {
      if (prev.length === res.length) {
        const a = idsKey(prev)
        const b = idsKey(res)
        if (a === b) return prev
      }
      return res
    })
  }, [])

  const onDisplayChange = useCallback((selected: Option[]) => {
    const next = selected.map((i) => i.value as VMCardData)
    setSelectedDisplayData((prev) => {
      if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev
      return next
    })
  }, [])

  // load display selections once
  useEffect(() => {
    try {
      const stored = localStorage.getItem('selectedDisplayData')
      if (stored) {
        const parsed = JSON.parse(stored) as VMCardData[]
        setSelectedDisplayData((prev) => {
          if (prev.length === parsed.length && prev.every((v, i) => v === parsed[i])) return prev
          return parsed
        })
      }
    } catch {
      // ignore
    }
  }, [])

  // persist display selections (no-op if unchanged)
  useEffect(() => {
    try {
      const serialized = JSON.stringify(selectedDisplayData)
      if (localStorage.getItem('selectedDisplayData') !== serialized) {
        localStorage.setItem('selectedDisplayData', serialized)
      }
    } catch {
      // ignore
    }
  }, [selectedDisplayData])

  // sync safeItems → searchResults only if content differs
  const lastSafeKeyRef = useRef('')
  useEffect(() => {
    const nextKey = idsKey(safeItems)
    if (nextKey !== lastSafeKeyRef.current) {
      lastSafeKeyRef.current = nextKey
    }
  }, [safeItems])

  const paginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  }

  const pageCount = Math.ceil(safeItems.length / limit)

  const clearUrl = () => {
    router.replace(pathname, { scroll: false })
    console.log(pathname)
  }

  const handleRefreshFilters = () => {
    setSelectedFilters({})
    setSelectedDisplayData([])
    clearUrl()
  }
  // ---------- Toggle/Sort params ----------
  const toggleParams = useMemo(() => {
    const entries: [string, string][] = (Object.entries(params) as Array<[string, unknown]>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])

    const newParams = new URLSearchParams(entries)
    if (filtersOpen) newParams.delete('filters')
    else newParams.set('filters', 'open')

    return `/vms?${newParams.toString()}`
  }, [params, filtersOpen])

  const toggleSortParams = useMemo(() => {
    if (!params.sort) return null
    const entries: [string, string][] = (Object.entries(params) as Array<[string, unknown]>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])

    const newParams = new URLSearchParams(entries)
    const currentOrder = newParams.get('order') === 'desc' ? 'desc' : 'asc'
    newParams.set('order', currentOrder === 'desc' ? 'asc' : 'desc')
    return { url: `/vms?${newParams.toString()}`, isDesc: currentOrder === 'desc' }
  }, [params])

  // ---------- Filtering / Sorting ----------
  const filteredItems = useMemo(() => {
    return safeItems.filter((vm) => {
      const powerstate = vm.virtualmachine?.status?.operatingsystem?.powerstate
      const powerStateFilter = selectedFilters['Power States']
      return !powerStateFilter?.length || (powerstate && powerStateFilter.includes(powerstate))
    })
  }, [safeItems, selectedFilters])

  const sortedItems = useMemo(() => {
    if (!params.sort) return filteredItems
    const sortOrder = params.order === 'desc' ? -1 : 1

    return [...filteredItems].sort((a, b) => {
      let valueA: string, valueB: string
      switch (params.sort) {
        case 'hostname':
          valueA = a.virtualmachine?.status?.operatingsystem?.hostname || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.hostname || ''
          break
        case 'name':
          valueA = a.virtualmachine?.status?.operatingsystem?.name || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.name || ''
          break
        case 'id':
          valueA = a.virtualmachine?.status?.operatingsystem?.id || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.id || ''
          break
        case 'powerstate':
          const powerStateA = a.virtualmachine?.status?.operatingsystem?.powerstate || 'undefined'
          const powerStateB = b.virtualmachine?.status?.operatingsystem?.powerstate || 'undefined'

          const getPowerStatePriority = (state: string) => {
            switch (state) {
              case 'poweredOn':
                return 1
              case 'poweredOff':
                return 2
              case 'undefined':
                return 3
              default:
                return 4
            }
          }

          const priorityA = getPowerStatePriority(powerStateA)
          const priorityB = getPowerStatePriority(powerStateB)
          return (priorityA - priorityB) * sortOrder
        case 'architecture':
          valueA = a.virtualmachine?.status?.operatingsystem?.architecture || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.architecture || ''
          break
        case 'family':
          valueA = a.virtualmachine?.status?.operatingsystem?.family || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.family || ''
          break
        case 'version':
          valueA = a.virtualmachine?.status?.operatingsystem?.version || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.version || ''
          break
        case 'toolversion':
          valueA = a.virtualmachine?.status?.operatingsystem?.toolversion || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.toolversion || ''
          break
        default:
          valueA = a.virtualmachine?.status?.operatingsystem?.hostname || ''
          valueB = b.virtualmachine?.status?.operatingsystem?.hostname || ''
      }
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * sortOrder
      }
      return String(valueA).localeCompare(String(valueB)) * sortOrder
    })
  }, [filteredItems, params.sort, params.order])

  const displayedItems = useMemo(() => {
    const base = params.sort ? sortedItems : filteredItems
    if (!searchResults?.length) return base
    const ids = new Set(searchResults.map(idOf))
    return base.filter((c) => ids.has(idOf(c)))
  }, [sortedItems, filteredItems, searchResults, params.sort])

  const renderControls = () => (
    <div className='flex flex-wrap items-center justify-between w-full gap-4 [@container(max-width:1000px)]:flex-col [@container(max-width:1000px)]:items-start [@container(max-width:1000px)]:gap-6'>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-6'>
        <VmSearch items={safeItems} onResultsChange={onSearchResultsChange} />

        <MultipleSelector
          className='w-52'
          commandProps={{ label: 'Display data' }}
          value={displayDataOptions.filter((opt) => selectedDisplayData?.includes(opt.value as VMCardData))}
          onChange={onDisplayChange}
          defaultOptions={displayDataOptions}
          placeholder='Set display data'
          hideClearAllButton
          hidePlaceholderWhenSelected
          emptyIndicator={<p className='text-center text-sm'>No results found</p>}
        />

        <SortSelect options={sortingOptions} currentSort={params.sort} />

        {toggleSortParams && (
          <Link href={toggleSortParams.url}>
            <Button variant='outline' className='border-[var(--input)]'>
              {toggleSortParams.isDesc ? (
                <span className='flex gap-1 items-center'>
                  <ArrowDownWideNarrow className='w-4 h-4' />
                  DESC
                </span>
              ) : (
                <span className='flex gap-1 items-center'>
                  <ArrowDownNarrowWide className='w-4 h-4' />
                  ASC
                </span>
              )}
            </Button>
          </Link>
        )}

        <Toggle
          asChild
          pressed={filtersOpen}
          variant='outline'
          className='[@container(max-width:1000px)]:hidden'
          aria-label='Open filters'
        >
          <Link href={toggleParams}>
            <Funnel aria-hidden='true' />
          </Link>
        </Toggle>
      </div>

      <div className='flex flex-row gap-4'>
        <Toggle
          pressed={filtersOpen}
          className='[@container(min-width:1001px)]:hidden'
          aria-label='Open filters'
          onPressedChange={(pressed) => {
            // Handle filter toggle without navigation
            const newUrl = new URL(window.location.href)
            if (pressed) {
              newUrl.searchParams.set('filters', 'open')
            } else {
              newUrl.searchParams.delete('filters')
            }
            window.history.replaceState({}, '', newUrl.toString())
          }}
        >
          <Funnel className='h-4 w-4' />
          Filters
        </Toggle>
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

        {/* View switcher for grid/list toggle */}
        <div className='flex gap-1 border rounded-md p-1'>
          <TabsViewSwitcher storageKey='vms:view-mode' />
        </div>
      </div>
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
            vms={(params.sort ? sortedItems : filteredItems)
              .filter((c) =>
                searchResults.some(
                  (sr) =>
                    sr.virtualmachine?.status?.operatingsystem?.id === c.virtualmachine?.status?.operatingsystem?.id ||
                    sr.virtualmachine?.status?.operatingsystem?.name ===
                      c.virtualmachine?.status?.operatingsystem?.name ||
                    sr.virtualmachine?.status?.operatingsystem?.hostname ===
                      c.virtualmachine?.status?.operatingsystem?.hostname
                )
              )
              .slice(
                paginationState.pageIndex * paginationState.pageSize,
                (paginationState.pageIndex + 1) * paginationState.pageSize
              )}
            selectedDisplayData={selectedDisplayData}
            pagination={paginationState}
            totalCount={filteredItems.length}
            pageCount={pageCount}
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
