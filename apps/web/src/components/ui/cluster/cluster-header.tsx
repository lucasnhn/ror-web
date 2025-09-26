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
  mgmt: ['bg-red-500', 'dark:bg-red-600'],
  kurs: ['bg-orange-400', 'dark:bg-orange-500'],
}

export const ClusterHeader = ({ className, tabs }: ClusterHeaderProps) => {
  const { cluster } = useClusterContext()

  const environment = cluster?.kubernetescluster?.spec?.data?.environment ?? 'unknown'
  const [lightmode, darkmode] = envBgColors[environment] || ['bg-gray-500', 'dark:bg-gray-600']
  const healthCondition = cluster?.kubernetescluster?.status?.conditions?.find(
    (condition) => condition.type === 'ready'
  )
  const clusterId = cluster?.kubernetescluster?.spec?.data?.clusterId
  const clusterName: string = cluster?.metadata?.name ? String(cluster.metadata.name) : (clusterId ?? 'Unknown Cluster')

  return (
    <div>
      <div className={cn(className, 'relative flex h-48 w-full')}>
        <div className='flex flex-col justify-between w-full h-full z-10'>
          <h1 className='text-center sm:text-left mx-auto sm:mx-12 my-auto sm:self-start text-4xl sm:text-[4rem]'>
            {clusterName}
          </h1>
          <NavigationTabs className='mb-0' items={tabs} tabColor={cn(lightmode, darkmode)} />
        </div>

        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full flex items-center text-black dark:text-white',
            'xl:[clip-path:polygon(760px_0,100%_0,100%_100%,920px_100%)] xl:pl-[940px]',
            'lg:[clip-path:polygon(560px_0,100%_0,100%_100%,680px_100%)] lg:pl-[720px]',
            'md:[clip-path:polygon(480px_0,100%_0,100%_100%,580px_100%)] md:pl-[620px]',
            '[clip-path:polygon(0_0,100%_0,100%_calc(100%-44px),0_calc(100%-44px))]',
            lightmode,
            darkmode
          )}
        >
          <div className='flex items-center gap-4'>
            <HealthCircle className='w-20 h-20 hidden lg:block' healthCondition={healthCondition} />
            <div className='flex flex-col font-bold xl:font-normal'>
              <p className='text-lg flex'>
                <span className='hidden xl:block'>Environment:&nbsp;</span>
                <span className='hidden md:block'>{environment?.toUpperCase() ?? 'UNKNOWN'}</span>
              </p>
              <p className='text-lg flex'>
                <span className='hidden xl:block'>Status:&nbsp;</span>
                <span className='hidden md:block'>
                  {healthCondition?.status
                    ? healthCondition.status.charAt(0).toUpperCase() + healthCondition.status.slice(1)
                    : 'Unknown'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
