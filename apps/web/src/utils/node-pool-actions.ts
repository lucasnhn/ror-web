'use server'

// import { authGuard } from '@/features/auth/utils/auth-guard'
// import { getRorApi, rorApiClient } from '@/services/ror-api'
import { getRorApi } from '@/services/ror-api'
import { revalidatePath } from 'next/cache'

export async function deleteNodePoolAction(clusterId: string, poolName: string) {
  // const session = await authGuard()

  // const client = rorApiClient(session.accessToken)
  const api = await getRorApi()

  await api.kubernetesClusters.removeNodePool(clusterId, poolName)

  revalidatePath(`/protected/clusters/${clusterId}/node-pools`)
}
