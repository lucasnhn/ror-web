import { KubernetesCluster } from '@ror/js-api-client'
import { useCallback, useMemo, useState } from 'react'
import { getDatacenter, getEnvironment, getWorkspace } from '../utils/cluster'

interface UseClusterFiltersResult {
  selectedFilters: Record<string, string[]>
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  filteredItems: KubernetesCluster[]
  resetFilters: () => void
}

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
