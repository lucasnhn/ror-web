'use client'

import MultipleSelector from '@/components/shadcn/multiselect'
import { filterOptions } from '@/features/cluster/config/page-view-options'

/**
 * Props for the ClusterFilterSection component.
 *
 * @property {boolean} filtersOpen - Indicates whether the filter section is open.
 * @property {Record<string, string[]>} selectedFilters - An object mapping filter names to arrays of selected values.
 * @property {React.Dispatch<React.SetStateAction<Record<string, string[]>>>} setSelectedFilters - Function to update the selected filters state.
 */
interface ClusterFilterSectionProps {
  filtersOpen: boolean
  selectedFilters: Record<string, string[]>
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

/**
 * Renders a section for filtering clusters using multiple selectors.
 *
 * @param filtersOpen - Determines whether the filter section is visible.
 * @param selectedFilters - An object mapping filter labels to their selected values.
 * @param setSelectedFilters - Callback to update the selected filters.
 */
export const ClusterFilterSection = ({
  filtersOpen,
  selectedFilters,
  setSelectedFilters,
}: ClusterFilterSectionProps) => {
  if (!filtersOpen) return null

  return (
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
}
