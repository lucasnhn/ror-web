'use client'

import type { Cluster } from '@ror/js-api-client'
import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'
import { Input } from '../shadcn/input'
import { Search } from 'lucide-react'

export interface ClusterSearchProps {
  items: Cluster[]
  onSelect?: (item: Cluster) => void
  onResultsChange?: (results: Cluster[]) => void
}

// TODO: Implement that the result is passed back to page, and cards are shown in that order
export function ClusterSearch({ items, onResultsChange }: ClusterSearchProps) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => {
    const flatClusters = items.map((cluster) => ({
      ...cluster,
      label: cluster.clusterName ?? cluster.clusterId, // fallback
    }))

    return new Fuse(flatClusters, {
      keys: ['label', 'workspace.name', 'topology.controlPlaneEndpoint', 'environment'], // Customize fields as needed
      threshold: 0.3,
    })
  }, [items])

  const results = useMemo(() => {
    return query ? fuse.search(query).map((result) => result.item) : items
  }, [query, fuse, items])

  useEffect(() => {
    onResultsChange?.(results)
  }, [results, onResultsChange])

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
