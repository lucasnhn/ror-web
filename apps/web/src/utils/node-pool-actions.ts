'use server'

// import { authGuard } from '@/features/auth/utils/auth-guard'
// import { getRorApi, rorApiClient } from '@/services/ror-api'
import { getRorApi } from '@/services/ror-api'
import { KubernetesClusterNodePool } from '@ror/js-api-client'
import { revalidatePath } from 'next/cache'

export async function deleteNodePoolAction(clusterId: string, poolName: string) {
  // const session = await authGuard()

  // const client = rorApiClient(session.accessToken)
  const api = await getRorApi()

  await api.kubernetesClusters.removeNodePool(clusterId, poolName)

  revalidatePath(`/protected/clusters/${clusterId}/node-pools`)
}

export async function createOrUpdateNodePoolAction(formData: FormData) {
  const api = await getRorApi()

  const clusterId = formData.get('id') as string
  const name = formData.get('name') as string | null
  const provider = formData.get('provider') as string | null
  const version = formData.get('version') as string | null
  const machineClass = formData.get('machineClass') as string | null
  const autoscaling = formData.get('autoscaling') === 'true'
  const labels = formData.get('labels') ? JSON.parse(formData.get('labels') as string) : undefined
  const taints = formData.get('taints') ? JSON.parse(formData.get('taints') as string) : undefined
  const replicas = !autoscaling ? Number(formData.get('replicas')) : null
  const minReplicas = autoscaling ? Number(formData.get('minReplicas')) : null
  const maxReplicas = autoscaling ? Number(formData.get('maxReplicas')) : null

  const nodePoolMetaData = {
    labels: labels && Object.keys(labels).length ? labels : undefined,
    annotations: taints && Object.keys(taints).length ? taints : undefined,
  }

  const autoScaling = {
    enabled: autoscaling,
    minReplicas: minReplicas,
    maxReplicas: maxReplicas,
    scalingRules: null, // TODO: add scaling rules, issue #286
  }

  const nodePool: KubernetesClusterNodePool = {
    name: name as string,
    version: version,
    metadata: nodePoolMetaData,
    provider: provider,
    replicas: replicas,
    machineClass: machineClass,
    autoscaling: autoScaling,
  }

  await api.kubernetesClusters.createOrUpdateNodePools(clusterId, nodePool)
  revalidatePath(`/protected/clusters/${clusterId}/node-pools`)
}
