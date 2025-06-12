import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { CodeSnippet } from '@ror/react/components/code-snippet'

interface ClusterPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClusterRawDataPage({ params }: ClusterPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const cluster = await client.kubernetesClusters.id(id)

  return (
    <div className=''>
      <h3>Version 1</h3>
      <CodeSnippet type='multi' style={{ '--code-snippet-multi-max-height': '40rem' }}>
        {JSON.stringify(cluster, null, 4)}
      </CodeSnippet>
    </div>
  )
}
