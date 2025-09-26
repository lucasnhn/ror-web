import * as React from 'react'

import { cn } from '@/utils/clsxm'
import { User } from 'next-auth'
import type { VirtualMachine } from '@/app/(protected)/vms/interfaces'
import { envBgColors } from '../cluster/cluster-header'
import { HealthCircle } from '../cluster/health-circle'
import { env } from 'process'

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

export type VMCardData =
  | 'os_hostName'
  | 'os_name'
  | 'os_id'
  | 'operatingSystemId'
  | 'powerState'
  | 'os_architecture'
  | 'os_family'
  | 'os_version'
  | 'os_toolVersion'

export interface VMCardProps {
  className?: string
  user?: User
  vm: VirtualMachine
  vmDisplayData: VMCardData[]
}

export const envColors: Record<string, 'red' | 'emerald' | 'gray'> = {
  poweredOff: 'red',
  poweredOn: 'emerald',
  undefined: 'gray',
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

const VMCard = ({ className, user, vm, vmDisplayData }: VMCardProps) => {
  const vmOs = vm.virtualmachine?.status?.operatingsystem
  const vmSpec = vm.virtualmachine?.spec
  const vmDdisks = vm.virtualmachine?.status?.disks
  const vmNetworks = vm.virtualmachine?.status?.networks

  const vmName = vmOs?.name
  const vmId = vmOs?.id
  const operatingSystemId = vmOs?.id
  const powerstate = vmOs?.powerstate
  const osArchitecture = vmOs?.architecture
  const osFamily = vmOs?.family
  const osVersion = vmOs?.version
  const osToolVersion = vmOs?.toolversion

  const envColor = vmEnvBgColors[powerstate ?? 'undefined'] ?? vmEnvBgColors['undefined']

  return (
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
              powerStatusBg[powerstate ?? 'undefined'][0]
            )}
          >
            <span className='font-mono font-bold text-card-foreground'>{powerstate || 'N/A'}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className='text-sm flex flex-col gap-3'>
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
  )
}

export { VMCard }
