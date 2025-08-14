import type { Metadata } from 'next'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { findPoolByName } from '@/utils/get-nodes-in-pool'
import { CreateEditView } from '../../create-edit-view'

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

export default async function EditNodePoolPage({ params }: EditNodePoolProps) {
  const { id, poolId } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  const [clusterResponse] = await Promise.all([client.kubernetesClusters.id(id)])

  const cluster = clusterResponse?.kubernetescluster
  const pools = cluster?.status?.state?.cluster?.nodepools ?? []

  const pool = findPoolByName(pools, poolId)

  console.log('[EDIT-NODE-POOL] pool:', pool)

  return (
    <div className=''>
      <CreateEditView id={id} title='Edit node pool' buttonText='Save changes' nodePool={pool} />
    </div>
  )
}
