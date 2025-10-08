import Fuse from 'fuse.js'
import { useMemo } from 'react'
import type { KubernetesCluster } from '@ror/js-api-client'

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

  return query ? fuse.search(query).map((r) => r.item) : items
}
