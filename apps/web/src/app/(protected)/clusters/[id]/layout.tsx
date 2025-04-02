import { authGuard } from '@/features/auth/utils/auth-guard'
import { HealthStatus } from '@/components/ui/health-status'
import { NavigationTabs } from '@/components/ui/navigation-tabs/navigation-tabs'
import { rorApiClient } from '@/services/ror-api'
import { Tile } from '@ror/react/components/tile'
import { format, formatDistance } from 'date-fns'
import { Fragment, ReactNode } from 'react'
import { ClusterPageBreadcrumbs } from './breadcrumbs'
import { routes } from '@/config/routes'

interface ClusterPageLayoutProps {
  params: Promise<{
    id: string
  }>
  children: ReactNode
}

const {
  cluster,
  clusterIngresses,
  clusterNodePools,
  clusterPolicies,
  clusterVulnerabilities,
  clusterCompliance,
  clusterAbout,
  clusterRawData,
} = routes.app

const createTabNavigationItems = (clusterId: string) => {
  return [
    {
      label: 'Details',
      href: cluster.getHref(clusterId),
    },
    {
      label: clusterIngresses.label,
      href: clusterIngresses.getHref(clusterId),
    },
    {
      label: clusterNodePools.label,
      href: clusterNodePools.getHref(clusterId),
    },
    {
      label: clusterPolicies.label,
      href: clusterPolicies.getHref(clusterId),
    },
    {
      label: clusterVulnerabilities.label,
      href: clusterVulnerabilities.getHref(clusterId),
    },
    {
      label: clusterCompliance.label,
      href: clusterCompliance.getHref(clusterId),
    },
    {
      label: clusterAbout.label,
      href: clusterAbout.getHref(clusterId),
    },
    {
      label: clusterRawData.label,
      href: clusterRawData.getHref(clusterId),
    },
  ]
}

export default async function ClusterPageLayout({ params, children }: ClusterPageLayoutProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)
  const cluster = await client.clusters.get(id)

  const tabs = createTabNavigationItems(id)

  const lastHeartbeatDate = new Date(cluster.lastObserved)
  const lastHeartbeatDateString = format(lastHeartbeatDate, 'yyyy-MM-dd HH:mm:ss')
  const lastHeartbeatDistance = formatDistance(lastHeartbeatDate, new Date())

  return (
    <Fragment>
      <Tile className='mb-4 min-h-40 rounded-none flex flex-col flex-start px-6 pt-6 md:pl-8' asChild>
        <header>
          <ClusterPageBreadcrumbs clusterId={cluster.clusterId} clusterName={cluster.clusterName} />
          <div className='flex items-center gap-8 mb-8'>
            <h1>{cluster.clusterName}</h1>
            <div className='flex flex-col gap-2'>
              <HealthStatus status={cluster.healthStatus.health} />
              <p className='text-sm text-(--r-text-secondary)'>
                Last heartbeat: {lastHeartbeatDateString} ({lastHeartbeatDistance} ago)
              </p>
            </div>
          </div>
          <NavigationTabs items={tabs} className='mt-auto -translate-x-5' />
        </header>
      </Tile>
      <div className='pt-2 px-6 md:px-6 md:pt-8'>{children}</div>
    </Fragment>
  )
}
