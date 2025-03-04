import { rorApiClient } from '@/services/ror-api'
import { authGuard } from '../auth-guard'
import { Breadcrumb, BreadcrumbItem } from '@ror/react/components/breadcrumb'
import { Tile } from '@ror/react/components/tile'
import { ClustersTable } from './cluster-table'

export default async function ClustersPage() {
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const clustersResponse = await client.clusters.filter()

  return (
    <div className='p-10'>
      <header className='mb-8'>
        <Breadcrumb className='mb-2'>
          <BreadcrumbItem isCurrentPage>Clusters</BreadcrumbItem>
        </Breadcrumb>
        <h1>Clusters</h1>
      </header>

      <ClustersTable data={clustersResponse.data} />

      <Tile className='mt-10'>
        <code>
          <pre>{JSON.stringify(clustersResponse, null, 2)}</pre>
        </code>
      </Tile>
    </div>
  )
}
