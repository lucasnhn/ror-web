/**
 * VM Search Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that provides a search functionality for Virtual Machines (VMs).
 * It uses the Fuse.js library for fuzzy searching and allows users to filter VMs based on various attributes.
 * The component includes a debounced input field to optimize performance and prevent excessive re-renders during typing.
 *
 */
'use client'

import { VmSearchProps } from '../utils/vms'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { useVmSearch } from '../hooks/use-vm-search'

export function VmSearch({ items, onResultsChange }: VmSearchProps) {
  const [query, setQuery] = useState('')

  const { search } = useVmSearch(items, {
    threshold: 0.3,
    keys: ['label', 'hostName', 'powerState', 'family'],
  })

  const [debouncedQuery, setDebouncedQuery] = useState(query)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 120)
    return () => clearTimeout(t)
  }, [query])

  const prevQueryRef = useRef('')
  const lastSentKeyRef = useRef('')

  useEffect(() => {
    const q = debouncedQuery
    const becameEmpty = !q && !!prevQueryRef.current

    if (q || becameEmpty) {
      const out = search(q) // Use the search function from the hook
      const nextKey = out.map((vm) => vm.metadata?.uid || '').join('|')
      if (nextKey !== lastSentKeyRef.current) {
        onResultsChange?.(out)
        lastSentKeyRef.current = nextKey
      }
    }

    prevQueryRef.current = q
  }, [debouncedQuery, search, onResultsChange])

  return (
    <div className='relative'>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label='Search VMs'
        placeholder='Search VMs...'
        icon={<Search className='h-4 w-4' />}
        iconPosition='left'
      />
    </div>
  )
}
