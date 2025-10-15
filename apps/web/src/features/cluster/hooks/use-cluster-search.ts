import Fuse from 'fuse.js'
import { useMemo } from 'react'
import type { KubernetesCluster } from '@ror/js-api-client'
import { getClusterName, getDatacenter, getEnvironment, getProvider } from '../utils/cluster'

/**
 * Custom hook to perform fuzzy search on a list of Kubernetes clusters.
 *
 * @param items - Array of KubernetesCluster objects to search.
 * @param query - Search string to filter clusters.
 * @returns Array of KubernetesCluster objects matching the search query.
 */
export function useClusterSearch(items: KubernetesCluster[], query: string) {
  const fuse = useMemo(() => {
    const flat = items.map((cluster) => ({
      ...cluster,
      label: getClusterName(cluster),
      datacenterName: getDatacenter(cluster),
      datacenterProvider: getProvider(cluster),
      environment: getEnvironment(cluster),
    }))

    return new Fuse(flat, {
      keys: ['label', 'datacenterName', 'datacenterProvider', 'environment'],
      threshold: 0.3,
    })
  }, [items])

  return query ? fuse.search(query).map((r) => r.item) : items
}
