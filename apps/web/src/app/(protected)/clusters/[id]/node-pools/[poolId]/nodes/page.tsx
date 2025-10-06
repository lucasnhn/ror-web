/*
 * FILE OVERVIEW
 *
 * Server component that fetches and displays the list of nodes in a
 * specific node pool within a Kubernetes cluster.
 */

import { findPoolByName, getNodesInPool } from '@/utils/get-nodes-in-pool'
import type { Metadata } from 'next'
import { getRorApi } from '@/services/ror-api'
import { DataTable } from '@/components/ui/data-table/data-table'
import { nodeColumns } from '@/features/cluster/components/nodes-columns'

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

/**
 * Renders the Nodes page for a specific node pool within a Kubernetes cluster.
 *
 * This async server component fetches the list of nodes for a given cluster and node pool,
 * retrieves cluster details, and displays the nodes in a data table.
 *
 * @param params - The route parameters containing the cluster ID (`id`) and node pool ID (`poolId`).
 * @returns A React fragment containing the page title and a data table of nodes in the selected pool.
 */
export default async function NodesPage({ params }: NodesPageProps) {
  const { id, poolId } = await params
  const api = await getRorApi()

  const [nodesResponse, clusterResponse] = await Promise.all([
    api.nodes.listByCluster(id),
    api.kubernetesClusters.id(id),
  ])

  const nodes = nodesResponse?.resources ?? []
  const cluster = clusterResponse?.kubernetescluster
  const pools = cluster?.status?.state?.cluster?.nodepools ?? []

  const pool = findPoolByName(pools, poolId)

  const nodesInPool = getNodesInPool(pool?.nodes ?? null, nodes, pool?.name ?? decodeURIComponent(poolId))

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>Nodes</h1>
      <DataTable columns={nodeColumns} data={nodesInPool} />
    </>
  )
}
