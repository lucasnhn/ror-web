/*
 * FILE OVERVIEW:
 *
 * Server component that prepares data and renders the CreateEditView
 * for editing a node pool within a cluster.
 *
 * Fetches machine class pricing via ROR API and passes it as props.
 */

import type { Metadata } from 'next'
import { getRorApi } from '@/services/ror-api'
import { findPoolByName } from '@/utils/get-nodes-in-pool'
import { CreateEditView } from '@/features/cluster/components/create-edit-view'

export const metadata: Metadata = {
  title: 'ROR - Edit node pool',
  description: 'Edit node pool',
}

interface EditNodePoolProps {
  params: {
    id: string
    poolId: string
  }
}

/**
 * Renders the Edit Node Pool page for a specific Kubernetes cluster and node pool.
 *
 * @param params - The route parameters containing the cluster ID (`id`) and node pool ID (`poolId`).
 * @returns A React component that displays the edit node pool form.
 */
export default async function EditNodePoolPage({ params }: EditNodePoolProps) {
  const { id, poolId } = params
  const api = await getRorApi()

  const clusterResponse = await api.kubernetesClusters.id(id)

  const cluster = clusterResponse?.kubernetescluster
  const pools = cluster?.status?.state?.cluster?.nodepools ?? []

  const pool = findPoolByName(pools, poolId)

  return <CreateEditView id={id} title='Edit node pool' buttonText='Save changes' nodePool={pool} />
}
