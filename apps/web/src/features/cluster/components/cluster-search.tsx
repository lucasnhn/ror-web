import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Input } from '@/components/shadcn/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useClusterSearch } from '../hooks/use-cluster-search'
import type { KubernetesCluster } from '@ror/js-api-client'

export interface ClusterSearchProps {
  items: KubernetesCluster[]
  onSelect?: (item: KubernetesCluster) => void
  onResultsChange?: (results: KubernetesCluster[]) => void
}

export function ClusterSearch({ items, onResultsChange }: ClusterSearchProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 120)
  const results = useClusterSearch(items, debouncedQuery)

  useEffect(() => {
    onResultsChange?.(results)
  }, [results, onResultsChange])

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
