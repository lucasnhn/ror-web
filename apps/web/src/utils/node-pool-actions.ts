'use server'

import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { KubernetesClusterNodePool } from '@ror/js-api-client'
import { revalidatePath } from 'next/cache'

export async function deleteNodePoolAction(clusterId: string, poolName: string) {
  const session = await authGuard()

  const client = rorApiClient(session.accessToken)

  await client.kubernetesClusters.removeNodePool(clusterId, poolName)

  revalidatePath(`/protected/clusters/${clusterId}/node-pools`)
}

export async function createOrUpdateNodePoolAction(formData: FormData) {
  const session = await authGuard()

  const client = rorApiClient(session.accessToken)

  const entries = Object.fromEntries(formData.entries())
  console.log('[NODE POOL ACTION]: entries - ', entries)

  const clusterId = formData.get('id') as string
  const name = formData.get('name') as string | null
  const machineClass = formData.get('machineClass') as string | null
  const autoscaling = formData.get('autoscaling') === 'true'
  const labels = formData.get('labels') ? JSON.parse(formData.get('labels') as string) : undefined
  const taints = formData.get('taints') ? JSON.parse(formData.get('taints') as string) : undefined
  const replicas = !autoscaling ? Number(formData.get('replicas')) : null
  const minReplicas = autoscaling ? Number(formData.get('minReplicas')) : null
  const maxReplicas = autoscaling ? Number(formData.get('maxReplicas')) : null

  // NODEPOOL:
  //     name?: string | null | undefined;
  //     version?: string | null | undefined;
  //     metadata?: {
  //         labels?: Record<string, string> | null | undefined;
  //         annotations?: Record<string, string> | null | undefined;
  //     } | null | undefined;
  //     provider?: string | null | undefined;
  //     replicas?: number | null | undefined;
  //     machineClass?: string | null | undefined;
  //     autoscaling?: {
  //         enabled?: boolean | null | undefined;
  //         minReplicas?: number | null | undefined;
  //         maxReplicas?: number | null | undefined;
  //         scalingRules?: string[] | null | undefined;
  //     } | null | undefined;

  const nodePoolMetaData = {
    labels: labels && Object.keys(labels).length ? labels : undefined,
    annotations: taints && Object.keys(taints).length ? taints : undefined,
  }

  const autoScaling = {
    enabled: autoscaling,
    minReplicas: minReplicas, // TODO: Check with text with Roger that this is correct
    maxReplicas: maxReplicas, // TODO: Check with text with Roger that this is correct
    scalingRules: null, // TODO: add scaling rules
  }

  const nodePool: KubernetesClusterNodePool = {
    name: name,
    version: 'TEST VERSION', // TODO: IMPLEMENT WAY TO GET VERSION
    metadata: nodePoolMetaData,
    provider: 'TEST PROVIDER', // TODO: IMPLEMENT WAY TO GET PROVIDER
    replicas: replicas, // TODO: Check with text with Roger that this is correct
    machineClass: machineClass,
    autoscaling: autoScaling,
  }

  // Get clusterId from a hidden input in the form
  // const clusterId = formData.get('id') as string

  // Extract all your form fields (add more as needed)
  // const name = formData.get('name') as string | null
  // const machineClass = formData.get('machineClass') as string | null
  // const autoscaling = formData.get('autoscaling') === 'true'
  // const replicas = formData.get('replicas') ? Number(formData.get('replicas')) : null
  // const minReplicas = formData.get('minReplicas') ? Number(formData.get('minReplicas')) : null
  // const maxReplicas = formData.get('maxReplicas') ? Number(formData.get('maxReplicas')) : null
  // const effect = formData.get('effect') as string | null

  // For object fields, pass as JSON.stringify and parse here!
  // const labels = formData.get('labels') ? JSON.parse(formData.get('labels') as string) : undefined
  // // TODO: handle taints and other complex fields if needed

  // const autoScaling = {
  //   enabled: autoscaling,
  //   minReplicas: minReplicas,
  //   maxReplicas: maxReplicas,
  //   scalingRules: null, // TODO: add scaling rules
  // }

  // const metaData = {}

  // const nodePool: KubernetesClusterNodePool = {
  //   machineClass: machineClass,
  //   provider: 'provider',
  //   version: 'version',
  //   name: name,
  //   replicas: replicas,
  //   autoscaling: autoScaling,
  //   metadata: metaData,
  // }

  // const nodePool2: any = {
  //   name,
  //   machineClass,
  //   provider,
  //   version,
  //   replicas: autoscalingEnabled ? null : nodeCount,
  // }

  // if (autoscalingEnabled) {
  //   nodePool.autoscaling = {
  //     enabled: true,
  //     minReplicas: minNodes,
  //     maxReplicas: maxNodes,
  //     scalingRules: null,
  //   }
  // }

  // if ((labels && Object.keys(labels).length) || (annotations && Object.keys(annotations).length)) {
  //   nodePool.metadata = {
  //     labels: labels && Object.keys(labels).length ? labels : undefined,
  //     annotations: annotations && Object.keys(annotations).length ? annotations : undefined,
  //   }
  // }

  // const session = await authGuard()
  // const client = rorApiClient(session.accessToken)

  // await client.kubernetesClusters.createOrUpdateNodePools(clusterId, nodePool)
  // revalidatePath(`/protected/clusters/${clusterId}/node-pools`)
}
