import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'

interface NodePoolsPageProps {
  params: Promise<{ id: string }>
}

export default async function NodePoolsPage({ params }: NodePoolsPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  const nodes = await client.nodes.listByCluster(id)

  console.log(nodes)

  return (
    <div>
      <h1>Node Pools</h1>
    </div>
  )
}
