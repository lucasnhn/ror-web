'use client'

import { cn } from '@/utils/clsxm'
import { HealthCircle } from './health-circle'
import { navigationItemObject } from '@/app/(protected)/clusters/[id]/layout'
import { NavigationTabs } from '../../../components/ui/navigation-tabs'
import { useClusterContext } from '@/context/cluster-context'
import { getEnvironmentColors } from '../utils/env-colors'
import { getClusterName, getEnvironment, getHealthCondition } from '../utils/cluster'

interface ClusterHeaderProps {
  className?: string
  tabs: navigationItemObject[]
}

interface ClusterStatusInfoProps {
  environment: string
  healthStatus?: string
}

export const ClusterStatusInfo = ({ environment, healthStatus }: ClusterStatusInfoProps) => {
  return (
    <div className='flex flex-col font-bold xl:font-normal'>
      <p className='text-lg flex'>
        <span className='hidden xl:block'>Environment:&nbsp;</span>
        <span className='hidden md:block'>{environment?.toUpperCase() ?? 'UNKNOWN'}</span>
      </p>
      <p className='text-lg flex'>
        <span className='hidden xl:block'>Status:&nbsp;</span>
        <span className='hidden md:block'>
          {healthStatus ? healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1) : 'Unknown'}
        </span>
      </p>
    </div>
  )
}

export const ClusterHeader = ({ className, tabs }: ClusterHeaderProps) => {
  const { cluster } = useClusterContext()

  const environment = getEnvironment(cluster)
  const [lightmode, darkmode] = getEnvironmentColors(environment)
  const healthCondition = getHealthCondition(cluster)
  const clusterName = getClusterName(cluster)

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
            <ClusterStatusInfo environment={environment} healthStatus={healthCondition?.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
