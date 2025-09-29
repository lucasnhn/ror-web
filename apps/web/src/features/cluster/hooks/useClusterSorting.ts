import { KubernetesCluster } from '@ror/js-api-client'
import { useMemo } from 'react'

interface UseClusterSortingProps {
  clusters: KubernetesCluster[]
  sort?: string
  order?: 'asc' | 'desc'
}

export function useClusterSorting({ clusters, sort, order }: UseClusterSortingProps) {
  return useMemo(() => {
    if (!sort) return clusters

    const sortOrder = order === 'desc' ? -1 : 1
    const isNumeric = ['cpu', 'memory', 'nodes', 'monthlyPrice', 'yearlyPrice'].includes(sort)

    return [...clusters].sort((a, b) => {
      const dataA = a.kubernetescluster?.spec?.data
      const dataB = b.kubernetescluster?.spec?.data
      const stateA = a.kubernetescluster?.status?.state?.cluster
      const stateB = b.kubernetescluster?.status?.state?.cluster

      const getValue = (): string | number => {
        switch (sort) {
          case 'clusterName':
            return a.metadata?.name ?? ''
          case 'cpu':
            return Number(stateA?.resources?.cpu?.percentage ?? 0)
          case 'memory':
            return Number(stateA?.resources?.memory?.percentage ?? 0)
          case 'nodes':
            return Number(stateA?.nodepools?.length ?? 0)
          case 'monthlyPrice':
            return Number(stateA?.price?.monthly ?? 0)
          case 'yearlyPrice':
            return Number(stateA?.price?.yearly ?? 0)
          case 'datacenterName':
            return dataA?.datacenter ?? ''
          case 'datacenterProvider':
            return dataA?.provider ?? ''
          case 'environment':
            return dataA?.environment ?? ''
          default:
            return a.metadata?.name ?? ''
        }
      }

      const valueA = getValue()
      const valueB = (() => {
        switch (sort) {
          case 'clusterName':
            return b.metadata?.name ?? ''
          case 'cpu':
            return Number(stateB?.resources?.cpu?.percentage ?? 0)
          case 'memory':
            return Number(stateB?.resources?.memory?.percentage ?? 0)
          case 'nodes':
            return Number(stateB?.nodepools?.length ?? 0)
          case 'monthlyPrice':
            return Number(stateB?.price?.monthly ?? 0)
          case 'yearlyPrice':
            return Number(stateB?.price?.yearly ?? 0)
          case 'datacenterName':
            return dataB?.datacenter ?? ''
          case 'datacenterProvider':
            return dataB?.provider ?? ''
          case 'environment':
            return dataB?.environment ?? ''
          default:
            return b.metadata?.name ?? ''
        }
      })()

      if (isNumeric) return (Number(valueB) - Number(valueA)) * sortOrder
      return String(valueA).localeCompare(String(valueB)) * sortOrder
    })
  }, [clusters, sort, order])
}
