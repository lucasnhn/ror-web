'use client'

import { cn } from '@/utils/clsxm'
import { HealthCircle } from './health-circle'
import { navigationItemObject } from '@/app/(protected)/clusters/[id]/layout'
import { NavigationTabs } from '../navigation-tabs'
import { useClusterContext } from '@/context/cluster-context'

interface ClusterHeaderProps {
  className?: string
  tabs: navigationItemObject[]
}

export const envBgColors: Record<string, string[]> = {
  prod: ['bg-red-500', 'dark:bg-red-600'],
  qa: ['bg-yellow-500', 'dark:bg-yellow-600'],
  dev: ['bg-blue-500', 'dark:bg-blue-600'],
  test: ['bg-emerald-500', 'dark:bg-emerald-600'],
}

export const ClusterHeader = ({ className, tabs }: ClusterHeaderProps) => {
  const { cluster } = useClusterContext()

  const environment = cluster.kubernetescluster?.spec?.data?.environment ?? 'unknown'
  const [lightmode, darkmode] = envBgColors[environment] || ['bg-gray-500', 'dark:bg-gray-600']
  const healthCondition = cluster.kubernetescluster?.status?.conditions?.find((condition) => condition.type === 'ready')
  const clusterId = cluster.kubernetescluster?.spec?.data?.clusterId
  const clusterName: string = cluster.metadata?.name ? String(cluster.metadata.name) : (clusterId ?? 'Unknown Cluster')

  return (
    <div>
      <div className={cn(className, 'relative flex h-48 w-full')}>
        <div className='flex flex-col justify-between h-full z-10'>
          <h1 className='px-12 self-start my-auto'>{clusterName}</h1>
          <NavigationTabs className='mb-0' items={tabs} tabColor={cn(lightmode, darkmode)} />
        </div>

        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full bg-blue-500 dark:bg-blue-600 [clip-path:polygon(800px_0,100%_0,100%_100%,1000px_100%)] flex items-center justify-start pl-[1024px] gap-8 text-black dark:text-white',
            lightmode,
            darkmode
          )}
        >
          <HealthCircle className='w-20 h-20' healthCondition={healthCondition} />
          <div className='flex flex-col w-fit'>
            <p className='text-lg'>Environment: {environment?.toUpperCase() ?? 'UNKNOWN'}</p>
            <p className='text-lg'>
              Status:{' '}
              {healthCondition?.status
                ? healthCondition.status.charAt(0).toUpperCase() + healthCondition.status.slice(1)
                : 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
