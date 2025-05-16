'use client'

import type { Cluster } from '@ror/js-api-client'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { Input } from '../shadcn/input'
import { Search } from 'lucide-react'
import { cn } from '@/utils/clsxm'

export interface ClusterSearchProps {
  items: Cluster[]
  onSelect?: (item: Cluster) => void
}

// TODO: Implement that the result is passed back to page, and cards are shown in that order
export function ClusterSearch({ items, onSelect }: ClusterSearchProps) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => {
    const flatClusters = items.map((cluster) => ({
      ...cluster,
      label: cluster.clusterName ?? cluster.clusterId, // fallback
    }))

    return new Fuse(flatClusters, {
      keys: ['label', 'workspace.name', 'topology.controlPlaneEndpoint', 'environment'], // Customize fields as needed
      threshold: 0.4,
    })
  }, [items])

  const results = query ? fuse.search(query).map((result) => result.item) : items

  return (
    <div className='relative'>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search clusters...'
        icon={<Search className='w-4 h-4' />}
        iconPosition='left'
      />

      {query && (
        <ul className='absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-md border bg-background shadow-lg text-sm'>
          {results.length > 0 ? (
            results.map((cluster) => (
              <li
                key={cluster.clusterId}
                className={cn('cursor-pointer px-4 py-2 hover:bg-muted', 'transition-colors')}
                onClick={() => onSelect?.(cluster)}
              >
                {cluster.clusterName}
              </li>
            ))
          ) : (
            <li className='px-4 py-2 text-muted-foreground'>No matches found</li>
          )}
        </ul>
      )}
    </div>
  )
}
