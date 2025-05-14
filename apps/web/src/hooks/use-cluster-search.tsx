'use client'

import { useMemo } from 'react'
import Fuse from 'fuse.js'

function flattenClusterData(obj: any, prefix = ''): string[] {
  const result: string[] = []

  for (const key in obj) {
    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (Array.isArray(value)) {
      value.forEach((v, i) => result.push(...flattenClusterData(v, `${newKey}[${i}]`)))
    } else if (typeof value === 'object' && value !== null) {
      result.push(...flattenClusterData(value, newKey))
    } else if (typeof value !== 'undefined') {
      result.push(`${newKey}:${String(value)}`)
    }
  }

  return result
}

export function useClusterSearch(clusters: any[]) {
  return useMemo(() => {
    const indexedClusters = clusters.map((cluster) => {
      const flat = flattenClusterData(cluster)
      return {
        id: cluster.clusterId,
        flatText: flat.join(' '),
      }
    })

    return new Fuse(indexedClusters, {
      keys: ['flatText'],
      threshold: 0.3,
    })
  }, [clusters])
}
