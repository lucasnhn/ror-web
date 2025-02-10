import { authGuard } from '@/app/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { Tile } from '@ror/react/components/tile'

export default async function DashboardPage() {
  const session = await authGuard()
  const self = await rorApiClient(session.accessToken).users.self()
  return (
    <div>
      <h1>Dashboard</h1>
      <Tile>
        <pre>{JSON.stringify(self, null, 2)}</pre>
      </Tile>
    </div>
  )
}
