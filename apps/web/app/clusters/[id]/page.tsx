import { authGuard } from '@/app/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { Breadcrumb, BreadcrumbItem } from '@ror/react/components/breadcrumb'
import { Tile } from '@ror/react/components/tile'
import Link from 'next/link'

interface ClusterPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const cluster = await client.clusters.get(id)

  return (
    <div className='p-10'>
      <header className='mb-8'>
        <Breadcrumb noTrailingSlash className='mb-2'>
          <BreadcrumbItem asChild>
            <Link href='/clusters'>Clusters</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{cluster.clusterName}</BreadcrumbItem>
        </Breadcrumb>
        <div className='flex items-center gap-4'>
          <h1>{cluster.clusterName}</h1>
        </div>
      </header>
      <Tile className='mt-10'>
        <code>
          <pre>{JSON.stringify(cluster, null, 2)}</pre>
        </code>
      </Tile>
    </div>
  )
}
