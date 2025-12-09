/**
 * VM Details Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that displays detailed information about a Virtual Machine (VM).
 * It uses a clean, responsive CSS grid layout to organize various attributes and actions related to the VM.
 *
 * LAYOUT STRUCTURE:
 * - Left Column (2/3 width): CPU usage, OS info, configuration details, team info
 * - Right Column (1/3 width): Control panel with VM power actions
 * - Responsive design that stacks on smaller screens
 * - Uses shadcn/ui Card components for consistent styling
 *
 */
'use client'

import { useVMContext } from '@/context/vm-context'
import { Pill } from '@/components/shadcn/pill'
import { vmActionsColors } from '../utils/env-colors'

import {
  getVmArchitecture,
  getVmFamily,
  getVmHostName,
  getVmOperatingSystemId,
  getVmName,
  getVmPowerState,
  getVmVersion,
  getSpecSockets,
  getSpecCoresPerSocket,
  getStatusCpuUsage,
  getVmToolVersion,
  getAdGroup,
  getSpecMemory,
  getTeamValue,
  VMDetailsProps,
  serviceIdDescription,
  serviceIdValue,
  getTeamDescription,
  getLocation,
} from '../utils/vms'
import { Card, CardContent, CardHeader as ShadcnCardHeader, CardTitle } from '@/components/shadcn/card'
import { DetailedCPUUsage } from './detailed-cpu-usage'
import { DetailedDiskUsage } from './detailed-disk-usage'

export const VMDetails = ({ user, className }: VMDetailsProps) => {
  const { vm } = useVMContext()
  const cpuUsage = getStatusCpuUsage(vm)
  const cpuSockets = getSpecSockets(vm)
  const cpuCoresPerSocket = getSpecCoresPerSocket(vm)
  const memory = getSpecMemory(vm)
  const memoryInGB = ((memory ?? 0) / 1024 ** 3).toFixed(2)

  const id = getVmOperatingSystemId(vm)
  const name = getVmName(vm)
  const version = getVmVersion(vm)
  const hostName = getVmHostName(vm)
  const architecture = getVmArchitecture(vm)
  const family = getVmFamily(vm)
  const powerState = getVmPowerState(vm)
  const toolVersion = getVmToolVersion(vm)

  const teamName = getTeamDescription(vm)
  const teamValue = getTeamValue(vm)
  const location = getLocation(vm)
  const serviceId = serviceIdDescription(vm)
  const serviceValue = serviceIdValue(vm)

  console.log(user)

  //TODO: fix this card, does not give much value or information as it is now
  const MemoryCard = () => (
    <Card>
      <ShadcnCardHeader>
        <CardTitle>Memory</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='flex flex-col gap-2'>
          <span className='text-2xl font-semibold'>{memoryInGB} GB</span>
        </div>
      </CardContent>
    </Card>
  )

  const ConfigurationCard = () => (
    <Card>
      <ShadcnCardHeader>
        <CardTitle>Configuration</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='flex flex-col gap-3'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-muted-foreground'>CPU Sockets:</span>
            <span className='font-medium'>{cpuSockets}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-muted-foreground'>CPU Cores per Socket:</span>
            <span className='font-medium'>{cpuCoresPerSocket}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CpuCard = () => <DetailedCPUUsage />

  const DiskCard = () => (
    <Card>
      <ShadcnCardHeader>
        <CardTitle>Disk Usage</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <DetailedDiskUsage />
      </CardContent>
    </Card>
  )

  const TeamCard = () => {
    if (!teamName) {
      return (
        <Card>
          <ShadcnCardHeader>
            <CardTitle>Team</CardTitle>
          </ShadcnCardHeader>
          <CardContent>
            <span className='font-medium'>No team assigned</span>
          </CardContent>
        </Card>
      )
    }
    return (
      <Card>
        <ShadcnCardHeader>
          <CardTitle>Team</CardTitle>
        </ShadcnCardHeader>
        <CardContent>
          <span className='font-medium'>
            {teamName} ({teamValue})
          </span>
        </CardContent>
      </Card>
    )
  }

  const LocationCard = () => (
    <Card>
      <ShadcnCardHeader>
        <CardTitle>Location</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <span className='font-medium'>{location}</span>
      </CardContent>
    </Card>
  )

  const ServiceIdCard = () => {
    if (!serviceId) {
      return (
        <Card>
          <ShadcnCardHeader>
            <CardTitle>Service ID</CardTitle>
          </ShadcnCardHeader>
          <CardContent>
            <span className='font-medium'>No Service ID assigned</span>
          </CardContent>
        </Card>
      )
    }
    return (
      <Card>
        <ShadcnCardHeader>
          <CardTitle>Service ID</CardTitle>
        </ShadcnCardHeader>
        <CardContent>
          <span className='font-medium'>
            {serviceId} ({serviceValue})
          </span>
        </CardContent>
      </Card>
    )
  }

  const InfoCard = () => (
    <Card>
      <ShadcnCardHeader>
        <CardTitle>Operating System</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>ID:</span>
              <span className='font-xs'>{id}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>OS Version:</span>
              <span className='font-xs'>{name}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Version:</span>
              <span className='font-xs'>{version}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Hostname:</span>
              <span className='font-xs'>{hostName}</span>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>VMware Tools:</span>
              <span className='font-xs'>{toolVersion}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Architecture:</span>
              <span className='font-xs'>{architecture}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Family:</span>
              <span className='font-xs'>{family}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ControlPanelCard = () => (
    <Card>
      <ShadcnCardHeader>
        <CardTitle>Control Panel</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-muted-foreground'>Power State:</span>
            <span className='font-medium'>
              {powerState === 'poweredOn' ? 'On' : powerState === 'poweredOff' ? 'Off' : 'Unknown'}
            </span>
          </div>

          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-muted-foreground'>Actions:</span>
            <div className='flex flex-wrap gap-2'>
              {powerState === 'poweredOff' && (
                <Pill
                  asChild
                  variant={vmActionsColors['powerOn']}
                  className='px-3 cursor-pointer'
                  onClick={() => {
                    // TODO: Implement turn on functionality
                  }}
                >
                  <button type='button'>Turn on</button>
                </Pill>
              )}
              {powerState === 'poweredOn' && (
                <Pill
                  asChild
                  variant={vmActionsColors['powerOff']}
                  className='px-3 cursor-pointer'
                  onClick={() => {
                    // TODO: Implement turn off functionality
                  }}
                >
                  <button type='button'>Turn off</button>
                </Pill>
              )}
              <Pill
                asChild
                variant={vmActionsColors['restart']}
                className='px-3 cursor-pointer'
                onClick={() => {
                  // TODO: Implement restart functionality
                }}
              >
                <button type='button'>Restart</button>
              </Pill>
              <Pill
                asChild
                variant={vmActionsColors['suspend']}
                className='px-3 cursor-pointer'
                onClick={() => {
                  // TODO: Implement suspend functionality
                }}
              >
                <button type='button'>Suspend</button>
              </Pill>
              <Pill
                asChild
                variant={vmActionsColors['delete']}
                className='px-3 cursor-pointer'
                onClick={() => {
                  // TODO: Implement delete functionality
                }}
              >
                <button type='button'>Delete</button>
              </Pill>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className={'space-y-4'}>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <TeamCard />
            <LocationCard />
            <ServiceIdCard />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <ConfigurationCard />
            <MemoryCard />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <CpuCard />
            <DiskCard />
          </div>
        </div>
        <div className='lg:col-span-1 space-y-4'>
          <ControlPanelCard />
          <InfoCard />
        </div>
      </div>
    </div>
  )
}
