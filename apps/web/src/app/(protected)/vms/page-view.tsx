'use client'

import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { PageViewProps, VirtualMachine } from './interfaces'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { cn } from '@/utils/clsxm'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { VMCard, VMCardData } from '@/components/ui/vm/vm-card'
import { Info } from 'lucide-react'
import { VMTable } from './vms-table'
import { Toggle } from '@radix-ui/react-toggle'
import Link from 'next/link'
import { Button } from '@/components/shadcn/button'
import { TabsViewSwitcher } from '@/components/ui/tabs-view-switcher'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { ArrowDownNarrowWide, ArrowDownWideNarrow, Download, Funnel, RotateCw } from 'lucide-react'
import { cleanUrl } from 'msw'

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

export const PageView = ({ className, user, vms, params }: PageViewProps) => {
  const DEFAULT_LIMIT = 3
  const DEFAULT_PAGE = 1

  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE
  const filtersOpen = params.filters === 'open'
  const pathname = usePathname()

  // pagination + infinite scroll
  const pageSize = 50
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [items, setItems] = useState<VirtualMachine[]>([])
  const sentinelRef = useRef<HTMLDivElement>(null)
  const inFlightRef = useRef(false)
  const router = useRouter()

  const idOf = (c: VirtualMachine) => c.virtualmachine?.status?.operatingsystem?.id || ''

  const idsKey = (arr: VirtualMachine[]) => arr.map(idOf).join('|')

  const safeItems = useMemo(
    () =>
      items.filter(
        (c) =>
          c.virtualmachine?.status?.operatingsystem && typeof c.virtualmachine?.status?.operatingsystem === 'object'
      ),
    [items]
  )
  const [selectedDisplayData, setSelectedDisplayData] = useState<VMCardData[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchResults, setSearchResults] = useState<VirtualMachine[]>(safeItems)

  // —— stable, equality-guarded handlers (avoid parent setState loops)
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
      setSearchResults((prev) => {
        const prevKey = idsKey(prev)
        return prevKey === nextKey ? prev : safeItems
      })
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

  const renderControls = () => (
    <div className='flex flex-wrap items-center justify-between w-full gap-4 [@container(max-width:1000px)]:flex-col [@container(max-width:1000px)]:items-start [@container(max-width:1000px)]:gap-6'>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-6'>
        {/* <ClusterSearch items={safeItems} onResultsChange={onSearchResultsChange} /> */}

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
        {safeItems.map((option) => (
          <MultipleSelector
            key={option.uid}
            className='w-52'
            commandProps={{ label: option.uid }}
            value={(selectedFilters[option.uid] || []).map((v) => ({ value: v, label: v }))}
            onChange={(selectedOptions) => {
              const next = selectedOptions.map((opt) => opt.value)
              setSelectedFilters((prev) => {
                const curr = prev[option.uid] || []
                const same = curr.length === next.length && curr.every((v, i) => v === next[i])
                if (same) return prev
                return { ...prev, [option.uid]: next }
              })
            }}
            defaultOptions={option.metadata?.name ? [{ label: option.metadata.name, value: option.metadata.name }] : []}
            placeholder={option.metadata?.name ? `Filter ${option.metadata.name}` : 'No filter available'}
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
        {/* {renderFilterSection()} */}
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
            vms={vms.slice(
              paginationState.pageIndex * paginationState.pageSize,
              (paginationState.pageIndex + 1) * paginationState.pageSize
            )}
            selectedDisplayData={
              selectedDisplayData.length > 0
                ? selectedDisplayData
                : displayDataOptions.map((opt) => opt.value as VMCardData)
            }
            pagination={paginationState}
            totalCount={vms.length}
            pageCount={Math.ceil(vms.length / limit)}
          />
        ) : (
          <div className='flex flex-row flex-wrap gap-6'>
            {vms.map((vm, idx) => (
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
