/**
 * VM Header Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that displays the header section for a Virtual Machine (VM) page.
 * It includes the VM's hostname, power state, and navigation tabs for different sections related to the VM.
 * The header is styled based on the VM's power state
 */
'use client'

import { cn } from '@/utils/clsxm'
import { navigationItemObject } from '@/app/(protected)/clusters/[id]/layout'
import { useVMContext } from '@/context/vm-context'
import { NavigationTabs } from '@/components/ui/navigation-tabs'
import { Power, PowerOff, TriangleAlert } from 'lucide-react'
import { vmHeaderColors } from '../utils/env-colors'

interface VMHeaderProps {
  className?: string
  tabs: navigationItemObject[]
}

export const VMHeader = ({ className, tabs }: VMHeaderProps) => {
  const { vm } = useVMContext()
  const hostname = vm?.virtualmachine?.status?.operatingsystem?.hostname || 'Unknown VM'
  const powerstate = vm?.virtualmachine?.status?.operatingsystem?.powerstate || 'undefined'
  const [lightmode, darkmode] = vmHeaderColors[powerstate] || ['bg-gray-200', 'dark:bg-gray-600']

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
