'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'

interface SortSelectProps {
  options: { value: string; label: string }[]
  currentSort: string | undefined
}

export function SortSelect({ options, currentSort }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.set('order', 'asc') // default to ascending on change
    router.push(`/clusters?${params.toString()}`)
  }

  return (
    <div className='flex flex-col mt-[-16px]'>
      <span className='text-xs'>Sorting</span>
      <Select onValueChange={handleChange} defaultValue={currentSort}>
        <SelectTrigger className='w-52'>
          <SelectValue placeholder='Select sorting' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
