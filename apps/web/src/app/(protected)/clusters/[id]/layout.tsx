import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { Fragment, ReactNode } from 'react'
import { routes } from '@/config/routes'
import { ClusterHeader } from '@/components/ui/cluster/cluster-header'

interface ClusterPageLayoutProps {
  params: Promise<{
    id: string
  }>
  children: ReactNode
}

// TODO: Uncomment the following lines when the respective components are available
const {
  cluster,
  // clusterIngresses,
  clusterNodePools,
  // clusterPolicies,
  // clusterVulnerabilities,
  // clusterCompliance,
  // clusterAbout,
  clusterRawData,
} = routes.app

export interface navigationItemObject {
  label: string
  href: string
}

const createTabNavigationItems = (clusterId: string) => {
  return [
    {
      label: 'Details',
      href: cluster.getHref(clusterId),
    },
    // {
    //   label: clusterIngresses.label,
    //   href: clusterIngresses.getHref(clusterId),
    // },
    {
      label: clusterNodePools.label,
      href: clusterNodePools.getHref(clusterId),
    },
    // {
    //   label: clusterPolicies.label,
    //   href: clusterPolicies.getHref(clusterId),
    // },
    // {
    //   label: clusterVulnerabilities.label,
    //   href: clusterVulnerabilities.getHref(clusterId),
    // },
    // {
    //   label: clusterCompliance.label,
    //   href: clusterCompliance.getHref(clusterId),
    // },
    // {
    //   label: clusterAbout.label,
    //   href: clusterAbout.getHref(clusterId),
    // },
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
  const cluster = await client.kubernetesClusters.idV1(id)

  const tabs = createTabNavigationItems(id)

  return (
    <Fragment>
      <div className='border-b'>
        <ClusterHeader cluster={cluster} tabs={tabs} />
      </div>
      <div className='pt-2 px-6 md:px-6 md:pt-8'>{children}</div>
    </Fragment>
  )
}
