'use client'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Input } from '@/components/shadcn/input'
import { Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useClusterSearch } from '../hooks/use-cluster-search'
import type { KubernetesCluster } from '@ror/js-api-client'

/**
 * Props for the ClusterSearch component.
 *
 * @property items - An array of KubernetesCluster objects to be searched.
 * @property onResultsChange - Optional callback invoked when the search results change,
 *   receiving the updated array of KubernetesCluster results.
 */
export interface ClusterSearchProps {
  items: KubernetesCluster[]
  onResultsChange?: (results: KubernetesCluster[]) => void
}

/**
 * Renders a search input for filtering clusters.
 *
 * @param items - The list of cluster items to search through.
 * @param onResultsChange - Optional callback invoked with the filtered results whenever the search query changes.
 */
export function ClusterSearch({ items, onResultsChange }: ClusterSearchProps) {
  const [query, setQuery] = useState('')

  const { search } = useClusterSearch(items, {
    threshold: 0.3,
    keys: ['label', 'datacenterName', 'datacenterProvider', 'environment'],
  })

  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 120)
    return () => clearTimeout(t)
  }, [query])

  const prevQueryRef = useRef('')
  const lastSentKeyRef = useRef('')

  // useEffect(() => {
  //   if (items?.length) {
  //     onResultsChange?.(items)
  //     lastSentKeyRef.current = items.map((c) => c.metadata?.uid || '').join('|')
  //     prevQueryRef.current = ''
  //   }
  // }, [items, onResultsChange])

  useEffect(() => {
    const q = debouncedQuery.trim()
    const becameEmpty = !q && !!prevQueryRef.current

    if (q || becameEmpty) {
      const out = search(q)
      const nextKey = out.map((cluster) => cluster.metadata?.uid || '').join('|')
      if (nextKey !== lastSentKeyRef.current) {
        onResultsChange?.(out)
        lastSentKeyRef.current = nextKey
      }
    }

    prevQueryRef.current = q
  }, [debouncedQuery, search, onResultsChange])

  // const debouncedQuery = useDebouncedValue(query, 120)
  // const results = useClusterSearch(items, debouncedQuery)

  // useEffect(() => {
  //   onResultsChange?.(results)
  // }, [results, onResultsChange])

  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label='Search clusters'
      placeholder='Find clusters...'
      icon={<Search className='w-4 h-4' />}
      iconPosition='left'
    />
  )
}

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
// 'use client'

// // import { VmSearchProps } from '../utils/vms'
// import { useEffect, useRef, useState } from 'react'
// import { Search } from 'lucide-react'
// import { Input } from '@/components/shadcn/input'
// import { VmSearchProps } from '@/features/vms/utils/vms'
// import { useVmSearch } from '@/features/vms/hooks/use-vm-search'
// import { useClusterSearch } from '../hooks/use-cluster-search'
// // import { useVmSearch } from '../hooks/use-vm-search'

// export function ClusterSearch({ items, onResultsChange }: VmSearchProps) {
//   const [query, setQuery] = useState('')

//   const { search } = useClusterSearch(items, {
//     threshold: 0.3,
//     keys: ['label', 'datacenterName', 'datacenterProvider', 'environment'],
//   })

//   const [debouncedQuery, setDebouncedQuery] = useState(query)

//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedQuery(query), 120)
//     return () => clearTimeout(t)
//   }, [query])

//   const prevQueryRef = useRef('')
//   const lastSentKeyRef = useRef('')

//     useEffect(() => {
//     const q = debouncedQuery.trim()
//     const becameEmpty = !q && !!prevQueryRef.current

//     if (q || becameEmpty) {
//       const out = search(q)
//       const nextKey = out.map((cluster) => cluster.metadata?.uid || '').join('|')
//       if (nextKey !== lastSentKeyRef.current) {
//         onResultsChange?.(out)
//         lastSentKeyRef.current = nextKey
//       }
//     }

//     prevQueryRef.current = q
//   }, [debouncedQuery, search, onResultsChange])

//   return (
//     <Input
//       value={query}
//       onChange={(e) => setQuery(e.target.value)}
//       aria-label='Search clusters'
//       placeholder='Find clusters...'
//       icon={<Search className='w-4 h-4' />}
//       iconPosition='left'
//     />
//   )
// }
