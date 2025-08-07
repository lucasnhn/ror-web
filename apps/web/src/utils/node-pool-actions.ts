'use server'

import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { revalidatePath } from 'next/cache'

export async function deleteNodePoolAction(clusterId: string, poolName: string) {
  const session = await authGuard()

  const client = rorApiClient(session.accessToken)

  await client.kubernetesClusters.removeNodePool(clusterId, poolName)

  revalidatePath(`/protected/clusters/${clusterId}/node-pools`)
}
