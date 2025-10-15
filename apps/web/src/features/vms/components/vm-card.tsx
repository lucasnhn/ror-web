/**
 * VM Card Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that displays a card view of a Virtual Machine (VM).
 * It includes various details about the VM, such as its name, hostname, ID, power state, and operating system information.
 * The card is styled based on the VM's power state and provides a link to the VM's detailed page.
 *
 */
'use client'

import * as React from 'react'

import { cn } from '@/utils/clsxm'
import Link from 'next/link'
import { vmCardPowerStatus, pillPowerStatusColors } from '@/features/vms/utils/env-colors'
import { VMCardProps } from '@/features/vms/utils/vms'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn('bg-[var(--r-layer)] text-card-foreground flex flex-col rounded-xl py-6 shadow-sm', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-header' className={cn('@container/card-header h-10', className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-title' className={cn('leading-none font-semibold', className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-content' className={cn('px-6', className)} {...props} />
}

const VMCard = ({ className, user, vm, vmDisplayData }: VMCardProps) => {
  const vmOs = vm.virtualmachine?.status?.operatingsystem

  const vmName = vmOs?.name
  const vmHostname = vmOs?.hostname
  const vmId = vmOs?.id
  const operatingSystemId = vmOs?.id
  const powerstate = vmOs?.powerstate
  const osArchitecture = vmOs?.architecture
  const osFamily = vmOs?.family
  const osVersion = vmOs?.version
  const osToolVersion = vmOs?.toolversion

  const envColor = vmCardPowerStatus[powerstate ?? 'undefined'] ?? vmCardPowerStatus['undefined']

  console.log(user)
  return (
    <Link href={`/vms/${vmHostname}`} onClick={() => localStorage.setItem('selectedVm', JSON.stringify(vm))}>
      <Card
        className={cn(
          'group w-sm min-w-64 pt-0 hover:bg-[#ededed] dark:hover:bg-neutral-800 hover:cursor-pointer @vm vm',
          className
        )}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && localStorage.setItem('selectedVm', JSON.stringify(vm))}
      >
        <CardHeader className='m-0 mb-7 p-0 w-full relative'>
          <CardTitle className={cn('text-2xl rounded-t-xl px-6 py-2 flex', envColor[0], envColor[1])}>
            {(vmName || 'Unnamed VM') as string}
            <span
              className={cn(
                'ml-auto flex items-center gap-1 text-xs font-normal normal-case px-2 py-1 rounded-full',
                pillPowerStatusColors[powerstate ?? 'undefined'][0]
              )}
            >
              <span className='font-mono font-bold text-card-foreground'>{powerstate || 'N/A'}</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='text-sm flex flex-col gap-3'>
          <div>
            <p className='text-sm font-semibold text-gray-400 '>Hostname</p>
            <p className='text-md'>{vmHostname || 'N/A'}</p>
            <div className='border-b border-gray-700 mt-1 mb-2'></div>
          </div>
          <section className='grid grid-cols-2 gap-4'>
            {vmDisplayData.includes('os_id') && (
              <div>
                <p className='font-bold'>ID</p>
                <p>{vmId || 'N/A'}</p>
              </div>
            )}
            {vmDisplayData.includes('operatingSystemId') && (
              <div>
                <p className='font-bold'>Operating System ID</p>
                <p>{operatingSystemId || 'N/A'}</p>
              </div>
            )}
            {vmDisplayData.includes('powerState') && (
              <div>
                <p className='font-bold'>Power State</p>
                <p>{powerstate || 'N/A'}</p>
              </div>
            )}
            {vmDisplayData.includes('os_architecture') && (
              <div>
                <p className='font-bold'>Architecture</p>
                <p>{osArchitecture || 'N/A'}</p>
              </div>
            )}
            {vmDisplayData.includes('os_family') && (
              <div>
                <p className='font-bold'>OS Family</p>
                <p>{osFamily || 'N/A'}</p>
              </div>
            )}
            {vmDisplayData.includes('os_version') && (
              <div>
                <p className='font-bold'>OS Version</p>
                <p>{osVersion || 'N/A'}</p>
              </div>
            )}
            {vmDisplayData.includes('os_toolVersion') && (
              <div>
                <p className='font-bold'>Tools Version</p>
                <p>{osToolVersion || 'N/A'}</p>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </Link>
  )
}

export { VMCard }
