'use client'

import { VmSearchProps } from '../utils/vms'
import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import { Input } from '@/components/shadcn/input'

export function VmSearch({ items, onResultsChange }: VmSearchProps) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => {
    const flat = items.map((vm) => ({
      ...vm,
      label: vm.metadata?.name ?? vm.virtualmachine?.spec?.name,
      hostname: vm.virtualmachine?.status?.operatingsystem?.hostname,
      powerState: vm.virtualmachine?.status?.operatingsystem?.powerstate,
      family: vm.virtualmachine?.status?.operatingsystem?.family,
    }))

    return new Fuse(flat, {
      keys: ['label', 'hostname', 'powerState', 'family'],
      threshold: 0.3,
    })
  }, [items])

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
      const out = q ? fuse.search(q).map((r) => r.item) : items
      const nextKey = out.map((vm) => vm.metadata?.uid || '').join('|')
      if (nextKey !== lastSentKeyRef.current) {
        onResultsChange?.(out)
        lastSentKeyRef.current = nextKey
      }
    }

    prevQueryRef.current = q
  }, [debouncedQuery, fuse, items, onResultsChange])

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
