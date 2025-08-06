import { Node } from '@ror/js-api-client'

type PoolNodeRef = string | { name?: string } | null | undefined

export function findPoolByName<T extends { name?: string | null }>(
  statePools: readonly T[],
  rawId: string | undefined
): T | undefined {
  const id = decodeURIComponent(rawId ?? '').trim()
  if (!id) return undefined

  const exact = statePools.find((p) => (p.name ?? '') === id)
  if (exact) return exact
  return statePools.find((p) => (p.name ?? '').toLowerCase() === id.toLowerCase())
}

export function getNodesInPool(
  poolNodes: PoolNodeRef[] | null | undefined,
  allNodes: Node[],
  poolName?: string
): Node[] {
  console.log('[GET NODES IN POOL]:', poolNodes, allNodes, poolName)
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
