import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { Button } from '@/components/shadcn/button'
import { ArrowDownWideNarrow, ArrowDownNarrowWide, Funnel, RotateCw, Download } from 'lucide-react'
import { SortSelect } from './sort-select'
import { TabsViewSwitcher } from './tabs-view-switcher'
import MultipleSelector, { Option } from '@/components/shadcn/multiselect'
import { ResourceSearch } from './resource-search'
import Link from 'next/link'
import { Toggle } from '../shadcn/toggle'

interface ResourceControlsProps<T> {
  safeItems: T[]
  searchText?: string
  selectedDisplayData: string[]
  onDisplayChange: (selected: Option[]) => void
  onSearchResultsChange: (results: T[]) => void
  displayDataOptions: Option[]
  handleRefreshFilters: () => void
  toggleParams: string
  toggleSortParams: { url: string; isDesc: boolean } | null
  filtersOpen: boolean
  params: { sort?: string }
  domain: string
  sortingOptions: Option[]
  searchKeys: string[]
  mapItem: (item: T) => Record<string, any>
  getItemsKey: (items: T[]) => string
  exportAsCSV: (items: T[], filename: string) => void
  exportAsExcel: (items: T[], filename: string) => void
}

export function ResourceControls<T>({
  safeItems,
  searchText,
  selectedDisplayData,
  onDisplayChange,
  onSearchResultsChange,
  displayDataOptions,
  handleRefreshFilters,
  toggleParams,
  toggleSortParams,
  filtersOpen,
  params,
  domain,
  sortingOptions,
  searchKeys,
  mapItem,
  getItemsKey,
  exportAsCSV,
  exportAsExcel,
}: ResourceControlsProps<T>) {
  return (
    <div className='flex flex-wrap items-center justify-between w-full gap-4 [@container(max-width:1000px)]:flex-col [@container(max-width:1000px)]:items-start [@container(max-width:1000px)]:gap-6'>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-6'>
        <ResourceSearch<T>
          items={safeItems}
          onResultsChange={onSearchResultsChange}
          searchText={searchText}
          keys={searchKeys}
          mapItem={mapItem}
          getItemsKey={getItemsKey}
        />

        <MultipleSelector
          className='w-52'
          commandProps={{ label: 'Display data' }}
          value={displayDataOptions.filter((opt) => selectedDisplayData?.includes(opt.value))}
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
          asChild
          pressed={filtersOpen}
          variant='outline'
          className='[@container(min-width:1001px)]:hidden'
          aria-label='Open filters'
        >
          <Link href={toggleParams}>
            <Funnel aria-hidden='true' />
          </Link>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportAsCSV(safeItems, `ror-${domain}-filtered.csv`)}>
              Export Filtered (CSV)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAsExcel(safeItems, `ror-${domain}-filtered.xlsx`)}>
              Export Filtered (Excel)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAsCSV(safeItems, `ror-${domain}-all.csv`)}>
              Export All (CSV)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAsExcel(safeItems, `ror-${domain}-all.xlsx`)}>
              Export All (Excel)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TabsViewSwitcher storageKey={`${domain}:view-mode`} />
      </div>
    </div>
  )
}
