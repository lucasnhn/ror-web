'use client'

import { cn } from '@/utils/clsxm'
import type { Cluster } from '@ror/js-api-client'
import { HealthCircle } from './health-circle'
import { navigationItemObject } from '@/app/(protected)/clusters/[id]/layout'
import { NavigationTabs } from '../navigation-tabs'

interface ClusterHeaderProps {
  className?: string
  cluster: Cluster
  tabs: navigationItemObject[]
}

const getHealthStatus = (health: number) => {
  switch (health) {
    case 1:
      return 'Good'
    case 2:
      return 'Smelly'
    case 3:
      return 'Bad'
    default:
      return 'Unknown'
  }
}

export const envBgColors: Record<string, string[]> = {
  prod: ['bg-red-500', 'dark:bg-red-600'],
  qa: ['bg-yellow-500', 'dark:bg-yellow-600'],
  dev: ['bg-blue-500', 'dark:bg-blue-600'],
  test: ['bg-emerald-500', 'dark:bg-emerald-600'],
}

export const ClusterHeader = ({ className, cluster, tabs }: ClusterHeaderProps) => {
  const [lightmode, darkmode] = envBgColors[cluster.environment!] || ['bg-gray-500', 'dark:bg-gray-600']

  return (
    <div>
      <div className={cn(className, 'relative flex h-48 w-full')}>
        <div className='flex flex-col justify-between h-full z-10'>
          <h1 className='px-12 self-start my-auto'>{cluster.clusterName}</h1>
          <NavigationTabs className='mb-0' items={tabs} tabColor={cn(lightmode, darkmode)} />
        </div>

        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full bg-blue-500 dark:bg-blue-600 [clip-path:polygon(800px_0,100%_0,100%_100%,1000px_100%)] flex items-center justify-start pl-[1024px] gap-8 text-black dark:text-white',
            lightmode,
            darkmode
          )}
        >
          <HealthCircle className='w-20 h-20' health={cluster.healthStatus.health} />
          <div className='flex flex-col w-fit'>
            <p className='text-lg'>Environment: {cluster.environment.toUpperCase()}</p>
            <p className='text-lg'>Status: {getHealthStatus(cluster.healthStatus.health)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
