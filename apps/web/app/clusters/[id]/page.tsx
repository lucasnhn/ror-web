import type { Metadata } from 'next'
import { authGuard } from '@/app/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { ClusterMetadataCard } from './metadata-card'
import { ClusterToolsCard } from './tools-card'
import { ClusterVersionsCard } from './versions-card'
import { ClusterMetrics } from './cluster-metrics'

interface ClusterPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'ROR (Beta) - Cluster',
  description: 'View and manage cluster details',
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const cluster = await client.clusters.get(id)

  return (
    <div className='grid grid-cols-12 gap-4 @container'>
      <ClusterMetrics cluster={cluster} className='col-span-12'/>
      <ClusterMetadataCard cluster={cluster} className='col-span-12 @5xl:col-span-6' />
      <ClusterToolsCard cluster={cluster} user={session.user} className='col-span-12 @2xl:col-span-6 @5xl:col-span-3' />
      <ClusterVersionsCard cluster={cluster} className='col-span-12 @2xl:col-span-6 @5xl:col-span-3' />
    </div>
  )
}
