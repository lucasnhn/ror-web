import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { NodePoolsTable } from './node-pools-table'
import { NodePoolsDataView } from './node-pools-data-view'

interface NodePoolsPageProps {
  params: Promise<{ id: string }>
}

export default async function NodePoolsPage({ params }: NodePoolsPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  const response = await client.nodes.listByCluster(id)

  const nodes = response?.resources ?? []

  return (
    <div>
      <NodePoolsTable nodes={nodes} />
      <NodePoolsDataView nodes={nodes} />
    </div>
  )
}
