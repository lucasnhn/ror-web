import { Breadcrumb, BreadcrumbItem } from '@ror/react/components/breadcrumb'
import Link from 'next/link'

interface ClusterPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { id } = await params

  return (
    <div>
      <header className='mb-8'>
        <Breadcrumb noTrailingSlash className='mb-2'>
          <BreadcrumbItem asChild>
            <Link href='/clusters'>Clusters</Link>
          </BreadcrumbItem>
          <BreadcrumbItem asChild>
            <Link href='/clusters'>Clusters</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Cluster ({id})</BreadcrumbItem>
        </Breadcrumb>
        <h1>Cluster ({id})</h1>
      </header>
    </div>
  )
}
