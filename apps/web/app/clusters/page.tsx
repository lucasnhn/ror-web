import { rorApiClient } from '@/services/ror-api'
import { authGuard } from '../auth-guard'
import { Breadcrumb, BreadcrumbItem } from '@ror/react/components/breadcrumb'
import { Tile } from '@ror/react/components/tile'

export default async function ClustersPage() {
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const clusters = await client.clusters.filter()
  return (
    <div>
      <header className='mb-8'>
        <Breadcrumb className='mb-2'>
          <BreadcrumbItem isCurrentPage>Clusters</BreadcrumbItem>
        </Breadcrumb>
        <h1>Clusters</h1>
      </header>

      <Tile>
        <code>
          <pre>{JSON.stringify(clusters, null, 2)}</pre>
        </code>
      </Tile>
    </div>
  )
}
