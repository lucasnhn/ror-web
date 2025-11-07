'use client'

import MultipleSelector from '@/components/shadcn/multiselect'
import { filterOptions } from '@/features/vms/config/page-view-options'

interface VmFilterSectionProps {
  filtersOpen: boolean
  selectedFilters: Record<string, string[]>
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

export const VmFilterSection = ({ filtersOpen, selectedFilters, setSelectedFilters }: VmFilterSectionProps) => {
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
