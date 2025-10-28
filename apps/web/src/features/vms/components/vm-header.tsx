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

import { navigationItemObject } from '@/app/(protected)/vms/[id]/layout'
import { useVMContext } from '@/context/vm-context'
import { Power, PowerOff, TriangleAlert } from 'lucide-react'
import { vmCardPowerStatus } from '../utils/env-colors'
import { ResourceHeader } from '@/components/ui/resource-header'

interface VMHeaderProps {
  className?: string
  tabs: navigationItemObject[]
}

export const VMHeader = ({ className, tabs }: VMHeaderProps) => {
  const { vm } = useVMContext()
  const hostname = vm?.virtualmachine?.status?.operatingsystem?.hostname || 'Unknown VM'
  const powerstate = vm?.virtualmachine?.status?.operatingsystem?.powerstate || 'undefined'
  const [lightmode, darkmode] = vmCardPowerStatus[powerstate] || ['bg-gray-200', 'dark:bg-gray-600']

  // Right-side content (status section)
  const rightContent = (
    <div className='flex items-center gap-4'>
      <div className='flex flex-col font-bold xl:font-normal'>
        <p className='text-lg flex items-center'>
          <span className='flex items-center pr-3'>
            {powerstate === 'poweredOn' ? (
              <Power size={32} />
            ) : powerstate === 'poweredOff' ? (
              <PowerOff size={32} />
            ) : (
              <TriangleAlert size={32} />
            )}
          </span>
          <span className='hidden xl:block'>Power state:&nbsp;</span>
          <span className='hidden md:block'>{powerstate}</span>
        </p>
      </div>
    </div>
  )

  return (
    <ResourceHeader
      className={className}
      title={hostname}
      tabs={tabs}
      rightContent={rightContent}
      lightmodeColor={lightmode}
      darkmodeColor={darkmode}
      titleSize='text-3xl sm:text-5xl'
    />
  )
}
