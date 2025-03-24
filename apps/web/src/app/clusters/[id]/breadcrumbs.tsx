'use client'
import { routes } from '@/config/routes'
import { Breadcrumb, BreadcrumbItem } from '@ror/react/components/breadcrumb'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

interface ClusterPageBreadcrumbsProps {
  clusterName: string
  clusterId: string
}

/**
 * Display the breadcrumbs for a cluster page.
 * For subpages we display the trailing slash after the cluster name.
 * There is no need to display the current page name as it already displayed in the sub-navigation
 */

export function ClusterPageBreadcrumbs({ clusterName, clusterId }: ClusterPageBreadcrumbsProps) {
  const segment = useSelectedLayoutSegment()
  const clusterPageActive = clusterId === segment

  return (
    <Breadcrumb noTrailingSlash={!segment} className='mb-10'>
      <BreadcrumbItem asChild>
        <Link href={routes.app.clusters.getHref()}>{routes.app.clusters.label}</Link>
      </BreadcrumbItem>
      {segment ? (
        <BreadcrumbItem isCurrentPage={clusterPageActive} asChild>
          <Link href={routes.app.cluster.getHref(clusterId)}>{clusterName}</Link>
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem isCurrentPage={clusterPageActive}>{clusterName}</BreadcrumbItem>
      )}
    </Breadcrumb>
  )
}
