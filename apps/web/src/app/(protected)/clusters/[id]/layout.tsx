'use client' // TODO: Remove when we are back to using repo

// import { getRorApi } from '@/services/ror-api'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { routes } from '@/config/routes'
import { ClusterHeader } from '@/components/ui/cluster/cluster-header'
import { ClusterProvider } from '@/context/cluster-context'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
// import { RenderApiError } from '@/utils/renderApiError'

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

// TODO: Add async when we are back to using api
// export default async function ClusterPageLayout({ params, children }: ClusterPageLayoutProps) {
export default function ClusterPageLayout({ params, children }: ClusterPageLayoutProps) {
  // TODO: Add back when we are back to using api
  // const { id } = await params

  const [id, setId] = useState('')
  const [cluster, setCluster] = useState(null)

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      const stored = localStorage.getItem('selectedCluster')
      setCluster(stored ? JSON.parse(stored) : null)
    })
  }, [params])

  if (!cluster) {
    return <div>Loading cluster data...</div>
  }

  const tabs = createTabNavigationItems(id)
  const clusterContextValue = { cluster }

  return (
    <ClusterProvider value={clusterContextValue}>
      <Fragment>
        <div className='border-b'>
          <ClusterHeader tabs={tabs} />
        </div>
        <NotReadyMessage className='mx-6 mt-8'>
          The page is still under development, so some data and functionality is missing.
        </NotReadyMessage>
        <div className='pt-2 px-6 md:px-6 md:pt-8'>{children}</div>
      </Fragment>
    </ClusterProvider>
  )
}
