import type { Metadata } from 'next'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { ClusterDetails } from '@/components/ui/cluster/cluster-details'
import { CodeSnippet } from '@ror/react'

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
  const cluster = await client.kubernetesClusters.idV1(id)

  return (
    <div className='@container'>
      <CodeSnippet type='single'>{session.accessToken}</CodeSnippet>
      <ClusterDetails cluster={cluster} />
    </div>
  )
}
