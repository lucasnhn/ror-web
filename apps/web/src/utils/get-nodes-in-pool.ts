import { KubernetesClusterNodePoolStatusType, Node } from '@ror/js-api-client'

type PoolNodeRef = string | { name?: string } | null | undefined

export function findPoolByName<T extends { name?: string | null }>(
  statePools: readonly T[],
  rawId: string | undefined
): T | KubernetesClusterNodePoolStatusType | undefined {
  console.log('[GET-NODES-IN-POOL] statePools:', statePools)
  console.log('[GET-NODES-IN-POOL] rawId:', rawId)
  const id = decodeURIComponent(rawId ?? '').trim()
  if (!id) return undefined

  const exact = statePools.find((p) => (p.name ?? '') === id)
  if (exact) return exact
  const returnStatePools = statePools.find((p) => (p.name ?? '').toLowerCase() === id.toLowerCase())
  console.log('[GET-NODES-IN-POOL] returnStatePools:', returnStatePools)
  return returnStatePools
}

export function getNodesInPool(
  poolNodes: PoolNodeRef[] | null | undefined,
  allNodes: Node[],
  poolName?: string
): Node[] {
  if (Array.isArray(poolNodes) && poolNodes.length) {
    const wanted = new Set(poolNodes.map((n) => (typeof n === 'string' ? n : n?.name)).filter(Boolean) as string[])
    return allNodes.filter((n) => wanted.has(n?.metadata?.name ?? ''))
  }

  if (poolName) {
    const key = `${poolName}-`
    return allNodes.filter((n) => (n?.metadata?.name ?? '').includes(key))
  }

  return []
}
