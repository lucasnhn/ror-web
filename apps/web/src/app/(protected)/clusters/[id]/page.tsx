import type { Metadata } from 'next'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { ClusterDetails } from '@/components/ui/cluster/cluster-details'
import { ClusterProvider } from '@/context/cluster-context'

interface ClusterPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'ROR - Cluster',
  description: 'View and manage cluster details',
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const cluster = await client.kubernetesClusters.id(id)

  if (!cluster) {
    // TODO: needs to be improved
    return <div>Loading cluster-data...</div>
  }

  const clusterContextValue = {
    cluster,
  }

  return (
    <ClusterProvider value={clusterContextValue}>
      <div className='@container'>
        <ClusterDetails />
      </div>
    </ClusterProvider>
  )
}
