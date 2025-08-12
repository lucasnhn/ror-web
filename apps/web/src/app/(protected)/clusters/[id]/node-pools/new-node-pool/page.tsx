import type { Metadata } from 'next'
import { CreateEditView } from '../create-edit-view'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { KubernetesCluster, KubernetesClusterNodePool } from '@ror/js-api-client'
import { revalidatePath } from 'next/cache'

export const metadata: Metadata = {
  title: 'ROR - Create node pool',
  description: 'Create new node pool',
}

interface NewNodePoolProps {
  params: Promise<{
    id: string
  }>
}

export default async function NewNodePoolPage({ params }: NewNodePoolProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  const cluster: KubernetesCluster = await client.kubernetesClusters.id(id)

  async function handleCreateNodePool(formData: FormData) {
    'use server'
    const session = await authGuard()
    const client = rorApiClient(session.accessToken)

    const clusterId = formData.get('id') as string
    const name = (formData.get('name') as string | null)?.trim() || null
    const machineClass = (formData.get('machineClass') as string | null)?.trim() || null

    if (!name || !machineClass) {
      throw new Error('Node pool must have name and machineClass')
    }

    const autoscaling = (formData.get('autoscaling') as string) === 'true'
    const replicas = formData.get('replicas') ? Number(formData.get('replicas')) : null
    const minReplicas = formData.get('minReplicas') ? Number(formData.get('minReplicas')) : null
    const maxReplicas = formData.get('maxReplicas') ? Number(formData.get('maxReplicas')) : null

    const labels = formData.get('labels')
      ? (JSON.parse(formData.get('labels') as string) as Record<string, string>)
      : undefined
    const annotations = formData.get('annotations')
      ? (JSON.parse(formData.get('annotations') as string) as Record<string, string>)
      : undefined

    const nodePool = {
      name,
      machineClass,
      // include provider/version only if your schema uses them & you have inputs:
      provider: (formData.get('provider') as string | null) ?? undefined,
      version: (formData.get('version') as string | null) ?? undefined,
      replicas: autoscaling ? null : replicas,
      autoscaling: autoscaling
        ? {
            enabled: true,
            minReplicas,
            maxReplicas,
            scalingRules: null,
          }
        : null,
      metadata:
        (labels && Object.keys(labels).length) || (annotations && Object.keys(annotations).length)
          ? { labels, annotations }
          : undefined,
    }

    await client.kubernetesClusters.createOrUpdateNodePools(clusterId, nodePool as KubernetesClusterNodePool)
    revalidatePath(`/protected/clusters/${clusterId}/node-pools`)
  }

  return (
    <div className=''>
      <CreateEditView
        id={id}
        title='New node pool'
        buttonText='Create node pool'
        cluster={cluster}
        onSubmit={handleCreateNodePool}
      />
    </div>
  )
}
