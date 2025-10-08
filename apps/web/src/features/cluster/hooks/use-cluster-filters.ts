import { KubernetesCluster } from '@ror/js-api-client'
import { useCallback, useMemo, useState } from 'react'
import { getDatacenter, getEnvironment, getWorkspace } from '../utils/cluster'

/**
 * Represents the result returned by the `useClusterFilters` hook.
 *
 * @property selectedFilters - An object mapping filter keys to arrays of selected filter values.
 * @property setSelectedFilters - A React state setter function to update the selected filters.
 * @property filteredItems - An array of `KubernetesCluster` objects that match the current filters.
 * @property resetFilters - A function to reset all filters to their initial state.
 */
interface UseClusterFiltersResult {
  selectedFilters: Record<string, string[]>
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  filteredItems: KubernetesCluster[]
  resetFilters: () => void
}

/**
 * Hook for managing and applying filters to a list of Kubernetes clusters.
 *
 * @param allClusters - An array of `KubernetesCluster` objects to be filtered.
 * @returns An object containing:
 * - `selectedFilters`: The current filter selections as a record mapping filter categories to selected values.
 * - `setSelectedFilters`: Setter function to update the selected filters.
 * - `filteredItems`: The array of clusters filtered according to the selected filters.
 * - `resetFilters`: Function to reset all filters to their initial state.
 */
export function useClusterFilters(allClusters: KubernetesCluster[]): UseClusterFiltersResult {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const filteredItems = useMemo(() => {
    return allClusters.filter((cluster) => {
      const env = getEnvironment(cluster)
      const dc = getDatacenter(cluster)
      const ws = getWorkspace(cluster)

      const envFilter = selectedFilters['Environments']
      const dcFilter = selectedFilters['Datacenters']
      const wsFilter = selectedFilters['Workspaces']

      if (envFilter?.length && !env) return false
      if (dcFilter?.length && !dc) return false
      if (wsFilter?.length && !ws) return false

      return (
        (!envFilter?.length || envFilter.includes(env)) &&
        (!dcFilter?.length || dcFilter.includes(dc)) &&
        (!wsFilter?.length || wsFilter.includes(ws))
      )
    })
  }, [allClusters, selectedFilters])

  const resetFilters = useCallback(() => {
    setSelectedFilters({})
  }, [])

  return { selectedFilters, setSelectedFilters, filteredItems, resetFilters }
}
