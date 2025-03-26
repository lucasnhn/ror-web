import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { ClusterIngressesTable } from './ingresses-table'

interface ClusterIngressesPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClusterIngressesPage({ params }: ClusterIngressesPageProps) {
  const { id } = await params

  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const cluster = await client.clusters.get(id)
  const ingresses = cluster.ingresses

  if (!ingresses) {
    return <div>No ingresses found</div>
  }

  return <ClusterIngressesTable ingresses={ingresses} />
}
