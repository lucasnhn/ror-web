import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Input } from '@/components/shadcn/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
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
