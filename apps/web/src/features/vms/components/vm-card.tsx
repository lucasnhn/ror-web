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
import {
  getTeamValue,
  getVmArchitecture,
  getVmFamily,
  getVmHostName,
  getVmOperatingSystemId,
  getVmName,
  getVmPowerState,
  getVmToolVersion,
  getVmVersion,
  VMCardProps,
} from '@/features/vms/utils/vms'
import { BackupStatusDisplay } from '@/features/backup/components'

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

const VMCard = ({ className, vm, vmDisplayData }: VMCardProps) => {
  const name = getVmName(vm)
  const id = getVmOperatingSystemId(vm)
  const family = getVmFamily(vm)
  const hostName = getVmHostName(vm)
  const version = getVmVersion(vm)
  const architecture = getVmArchitecture(vm)
  const toolVersion = getVmToolVersion(vm)
  const powerState = getVmPowerState(vm)

  const teamName = getTeamValue(vm)

  const envColor = vmCardPowerStatus[powerState ?? 'undefined'] ?? vmCardPowerStatus['undefined']

  const Info = ({ label, value }: { label: string; value: string | number }) => {
    return (
      <div>
        <p className='font-bold'>{label}</p>
        <p>{value}</p>
      </div>
    )
  }

  return (
    <Link href={`/vms/${hostName}`} onClick={() => localStorage.setItem('selectedVm', JSON.stringify(vm))}>
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
          <CardTitle className={cn('text-sm rounded-t-xl px-6 py-2 flex', envColor[0], envColor[1])}>
            {hostName}
            <span
              className={cn(
                'ml-auto flex items-center text-xs font-normal normal-case px-2 rounded-full',
                pillPowerStatusColors[powerState ?? 'undefined'][0]
              )}
            >
              <span className='font-mono font-bold text-card-foreground'>{powerState || 'N/A'}</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='text-sm flex flex-col gap-3'>
          <div>
            <p className='text-sm font-semibold text-gray-400 '>Team</p>
            <p className='text-md'>{teamName || 'N/A'}</p>
            <div className='border-b border-gray-700 mt-1 mb-2'></div>
          </div>
          <section className='grid grid-cols-2 gap-4'>
            {vmDisplayData?.includes('name') && <Info label='OS-version' value={name ?? 'N/A'} />}
            {vmDisplayData?.includes('id') && <Info label='ID' value={id ?? 'N/A'} />}
            {vmDisplayData?.includes('powerState') && <Info label='Power' value={powerState ?? 'N/A'} />}
            {vmDisplayData?.includes('architecture') && <Info label='Architecture' value={architecture ?? 'N/A'} />}
            {vmDisplayData?.includes('family') && <Info label='OS-type' value={family ?? 'N/A'} />}
            {vmDisplayData?.includes('version') && <Info label='Version' value={version ?? 'N/A'} />}
            {vmDisplayData?.includes('toolVersion') && (
              <Info label='VMware Tools version' value={toolVersion ?? 'N/A'} />
            )}
          </section>
          <div className='border-b border-gray-700 mt-1 mb-2'></div>
          {vmDisplayData?.includes('lastBackup') && <BackupStatusDisplay vm={vm} />}
        </CardContent>
      </Card>
    </Link>
  )
}

export { VMCard }
