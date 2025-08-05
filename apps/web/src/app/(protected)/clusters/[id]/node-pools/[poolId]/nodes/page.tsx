// import { authGuard } from '@/features/auth/utils/auth-guard'
// import { rorApiClient } from '@/services/ror-api'
// import type { Metadata } from 'next'
// import { NodesDataView } from './nodes-data-view'
// import { getNodesInPool } from '@/utils/get-nodes-in-pool'
// export default async function NodesPage({ params }: NodesPageProps) {
//   const { id, poolId } = await params
//   const session = await authGuard()
//   const client = rorApiClient(session.accessToken)

//   const [nodesResponse, clusterResponse] = await Promise.all([
//     client.nodes.listByCluster(id),
//     client.kubernetesClusters.id(id),
//   ])

//   const nodes = nodesResponse?.resources ?? []
//   const cluster = clusterResponse?.kubernetescluster
//   const pools = cluster?.status?.state?.cluster?.nodepools ?? []
//   const pool = pools.find((p) => p.name === poolId)

//   console.log('[POOLS]:', pools)

//   const nodesInPool = getNodesInPool(pool?.nodes, nodes, pool?.name ?? undefined)

//   console.log('[NODES IN POOL]:', nodesInPool)

//   return (
//     <div className=''>
//       <NodesDataView data={nodesInPool} />
//     </div>
//   )
// }

import { findPoolByName, getNodesInPool } from '@/utils/get-nodes-in-pool'
import { NodesDataView } from './nodes-data-view'
import type { Metadata } from 'next'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'

export const metadata: Metadata = {
  title: 'ROR - Nodes',
  description: 'Nodes in a node pool',
}

interface NodesPageProps {
  params: Promise<{
    id: string
    poolId: string
  }>
}

export default async function NodesPage({ params }: NodesPageProps) {
  const { id, poolId } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  const [nodesResponse, clusterResponse] = await Promise.all([
    client.nodes.listByCluster(id),
    client.kubernetesClusters.id(id),
  ])

  const nodes = nodesResponse?.resources ?? []
  const cluster = clusterResponse?.kubernetescluster
  const pools = cluster?.status?.state?.cluster?.nodepools ?? []

  const pool = findPoolByName(pools, poolId)

  const nodesInPool = getNodesInPool(pool?.nodes ?? null, nodes, pool?.name ?? decodeURIComponent(poolId))

  return (
    <div className=''>
      <NodesDataView data={nodesInPool} />
    </div>
  )
}
