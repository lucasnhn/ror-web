import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'

export default async function NodePoolsPage() {
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  const nodes = await client.nodes.list()

  console.log(nodes)

  return (
    <div>
      <h1>Node Pools</h1>
    </div>
  )
}
