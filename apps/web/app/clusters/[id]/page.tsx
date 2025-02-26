import { KubernetesLogo } from '@/components/common/kubernetes-logo'
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
        <Breadcrumb noTrailingSlash className='mb-4'>
          <BreadcrumbItem asChild>
            <Link href='/clusters'>Clusters</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Cluster ({id})</BreadcrumbItem>
        </Breadcrumb>
        <div className='flex items-center gap-4'>
          <KubernetesLogo className='h-10 w-10' />
          <h1>{id}</h1>
        </div>
      </header>
    </div>
  )
}
