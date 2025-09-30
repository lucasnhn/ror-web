'use client'

import { cn } from '@/utils/clsxm'
import { navigationItemObject } from '@/app/(protected)/clusters/[id]/layout'
import { useVMContext } from '@/context/vm-context'
import { NavigationTabs } from '../navigation-tabs'
import { Power, PowerOff, TriangleAlert } from 'lucide-react'

interface VMHeaderProps {
  className?: string
  tabs: navigationItemObject[]
}

const vmEnvBgColors: Record<string, [string, string]> = {
  poweredOff: ['bg-red-200', 'text-red-900'],
  poweredOn: ['bg-emerald-200', 'text-emerald-900'],
  undefined: ['bg-gray-200', 'text-gray-900'],
}

const powerStatusBg: Record<string, [string, string]> = {
  poweredOff: ['bg-red-900', 'text-red-300'],
  poweredOn: ['bg-emerald-900', 'text-emerald-300'],
  undefined: ['bg-gray-900', 'text-gray-300'],
}

export const VMHeader = ({ className, tabs }: VMHeaderProps) => {
  const { vm } = useVMContext()
  const hostname = vm?.virtualmachine?.status?.operatingsystem?.hostname || 'Unknown VM'
  const powerstate = vm?.virtualmachine?.status?.operatingsystem?.powerstate || 'undefined'
  const [lightmode, darkmode] = vmEnvBgColors[powerstate] || ['bg-gray-200', 'dark:bg-gray-600']

  return (
    <div>
      <div className={cn(className, 'relative flex h-48 w-full')}>
        <div className='flex flex-col justify-between w-full h-full z-10'>
          <h1 className='text-center sm:text-left mx-auto sm:mx-12 my-auto sm:self-start text-3xl sm:text-5xl'>
            {hostname}
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
            <div className='flex flex-col font-bold xl:font-normal'>
              <p className='text-lg flex'>
                <span className='flex items-center pr-3'>
                  {powerstate === 'poweredOn' ? (
                    <>
                      <Power size={32} className='hidden md:inline xl:hidden' />
                      <Power size={32} className='hidden xl:inline' />
                    </>
                  ) : powerstate === 'poweredOff' ? (
                    <>
                      <PowerOff size={32} className='hidden md:inline xl:hidden' />
                      <PowerOff size={32} className='hidden xl:inline' />
                    </>
                  ) : (
                    <>
                      <TriangleAlert size={32} className='hidden md:inline xl:hidden' />
                      <TriangleAlert size={32} className='hidden xl:inline' />
                    </>
                  )}
                </span>
                <span className='hidden xl:block'>Power state:&nbsp;</span>
                <span className='hidden md:block'>{powerstate || 'undefined'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
