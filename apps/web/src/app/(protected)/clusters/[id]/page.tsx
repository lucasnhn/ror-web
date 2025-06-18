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
  return (
    <div className='@container'>
      <ClusterDetails />
    </div>
  )
}
