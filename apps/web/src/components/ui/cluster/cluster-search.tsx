// 'use client'

// import type { KubernetesCluster } from '@ror/js-api-client'
// import Fuse from 'fuse.js'
// import { useEffect, useMemo, useState } from 'react'
// import { Search } from 'lucide-react'
// import { Input } from '@/components/shadcn/input'

// export interface ClusterSearchProps {
//   items: KubernetesCluster[]
//   onSelect?: (item: KubernetesCluster) => void
//   onResultsChange?: (results: KubernetesCluster[]) => void
// }

// // TODO: Implement that the result is passed back to page, and cards are shown in that order
// export function ClusterSearch({ items, onResultsChange }: ClusterSearchProps) {
//   const [query, setQuery] = useState('')

//   const fuse = useMemo(() => {
//     const flatClusters = items.map((cluster) => ({
//       ...cluster,
//       label: cluster.metadata?.name ?? cluster.kubernetescluster?.spec?.data?.clusterId,
//       datacenterName: cluster.kubernetescluster?.spec?.data?.datacenter,
//       datacenterProvider: cluster.kubernetescluster?.spec?.data?.provider,
//       environment: cluster.kubernetescluster?.spec?.data?.environment,
//       // TODO: Add health
//     }))

//     return new Fuse(flatClusters, {
//       keys: ['label', 'datacenterName', 'datacenterProvider', 'environment'],
//       threshold: 0.3,
//     })
//   }, [items])

//   const results = useMemo(() => {
//     return query ? fuse.search(query).map((result) => result.item) : items
//   }, [query, fuse, items])

//   useEffect(() => {
//     onResultsChange?.(results)
//   }, [results, onResultsChange])

//   return (
//     <div className='relative'>
//       <Input
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder='Find clusters...'
//         icon={<Search className='w-4 h-4' />}
//         iconPosition='left'
//       />
//     </div>
//   )
// }

'use client'

import type { KubernetesCluster } from '@ror/js-api-client'
import Fuse from 'fuse.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/shadcn/input'

// small helper for stable comparisons (optional but nice)
const idOf = (c: KubernetesCluster) => c.kubernetescluster?.spec?.data?.clusterId || c.metadata?.name || ''

export interface ClusterSearchProps {
  items: KubernetesCluster[]
  onSelect?: (item: KubernetesCluster) => void
  onResultsChange?: (results: KubernetesCluster[]) => void
}

export function ClusterSearch({ items, onResultsChange }: ClusterSearchProps) {
  const [query, setQuery] = useState('')

  // Build Fuse index only when items change
  const fuse = useMemo(() => {
    const flat = items.map((cluster) => ({
      ...cluster,
      label: cluster.metadata?.name ?? cluster.kubernetescluster?.spec?.data?.clusterId,
      datacenterName: cluster.kubernetescluster?.spec?.data?.datacenter,
      datacenterProvider: cluster.kubernetescluster?.spec?.data?.provider,
      environment: cluster.kubernetescluster?.spec?.data?.environment,
    }))

    return new Fuse(flat, {
      keys: ['label', 'datacenterName', 'datacenterProvider', 'environment'],
      threshold: 0.3,
    })
  }, [items])

  // Compute filtered results (pure)
  const filtered = useMemo(() => {
    if (!query) return items
    return fuse.search(query).map((r) => r.item)
  }, [query, fuse, items])

  // Debounce query so we don't fire on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 120)
    return () => clearTimeout(t)
  }, [query])

  // Only notify parent when:
  //  - query is non-empty (user is filtering), OR
  //  - query changed from non-empty -> empty (user cleared the search)
  const prevQueryRef = useRef('')
  const lastSentKeyRef = useRef('')

  useEffect(() => {
    const q = debouncedQuery
    const becameEmpty = !q && !!prevQueryRef.current

    if (q || becameEmpty) {
      const out = q ? fuse.search(q).map((r) => r.item) : items
      const nextKey = out.map(idOf).join('|')
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
        placeholder='Find clusters...'
        icon={<Search className='w-4 h-4' />}
        iconPosition='left'
      />
    </div>
  )
}
