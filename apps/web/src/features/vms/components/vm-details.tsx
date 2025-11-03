/**
 * VM Details Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that displays detailed information about a Virtual Machine (VM).
 * It uses a responsive grid layout to organize various attributes and actions related to the VM.
 * The component is designed to be interactive, allowing users to resize and rearrange the layout.
 *
 */
'use client'

import { useVMContext } from '@/context/vm-context'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { cn } from '@/utils/clsxm'
import type { Layout, Layouts } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useState } from 'react'
import { Pill } from '@/components/shadcn/pill'
import { vmActionsColors } from '../utils/env-colors'

import {
  getVmArchitecture,
  getVmFamily,
  getVmHostName,
  getVmId,
  getVmName,
  getVmPowerState,
  getVmVersion,
  getSpecSockets,
  getSpecCoresPerSocket,
  getStatusCpuUsage,
  getVmToolVersion,
  getAdGroup,
  getSpecMemory,
  getTeamName,
  getTeamValue,
  VMDetailsProps,
  serviceIdDescription,
  serviceIdValue,
} from '../utils/vms'
import { standardLayouts } from '@/features/vms/config/vm-details-layout'

const ResponsiveGridLayout = WidthProvider(Responsive)

const CardHeader = ({ title }: { title: string }) => {
  return (
    <div className='mb-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>
      <hr />
    </div>
  )
}

export const VMDetails = ({ user, className }: VMDetailsProps) => {
  const { vm } = useVMContext()
  const [layoutKey] = useState(0)
  const [layout, setLayout] = useState<Layout[]>(standardLayouts.lg)
  const [savedLayouts] = useState<Layouts>(standardLayouts)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')

  console.log(currentBreakpoint) // For future use if needed
  console.log(layout) // For future use if needed
  const cpuUsage = getStatusCpuUsage(vm)
  const cpuSockets = getSpecSockets(vm)
  const cpuCoresPerSocket = getSpecCoresPerSocket(vm)
  const memory = getSpecMemory(vm)
  const memoryInGB = ((memory ?? 0) / 1024 ** 3).toFixed(2)

  const id = getVmId(vm)
  const name = getVmName(vm)
  const version = getVmVersion(vm)
  const hostName = getVmHostName(vm)
  const architecture = getVmArchitecture(vm)
  const family = getVmFamily(vm)
  const powerState = getVmPowerState(vm)
  const toolVersion = getVmToolVersion(vm)

  const teamName = getTeamName(vm)
  const teamValue = getTeamValue(vm)
  const AdGroup = getAdGroup(vm)
  const serviceId = serviceIdDescription(vm)
  const serviceValue = serviceIdValue(vm)

  console.log(user)

  return (
    <div>
      <div className='w-full border rounded-xl p-2'>
        <style>
          {`
            .react-resizable-handle :after { border-color: black; }
            .dark .react-resizable-handle::after { border-color: white; }
            .react-resizable-handle::after { scale: 2; }
            .react-resizable-handle::after { margin-right: 8px; }
            .react-resizable-handle::after { margin-bottom: 8px; }
            .react-grid-item.react-grid-placeholder { background-color: #58acf2; }
            .dark .react-grid-item.react-grid-placeholder { background-color: #3e88c5; }
          `}
        </style>
        <ResponsiveGridLayout
          className={cn(
            'layout w-full',
            '[&>div]:bg-[var(--r-layer)] [&>div]:rounded-lg [&>div]:p-4 [&>div]:shadow [&>div]:cursor-move',
            className
          )}
          key={layoutKey}
          layouts={savedLayouts}
          breakpoints={{ lg: 1856, md: 1200, sm: 640, xs: 512 }}
          cols={{ lg: 42, md: 24, sm: 12, xs: 6 }}
          rowHeight={30}
          draggableHandle='.drag-handle'
          draggableCancel='.no-drag'
          onLayoutChange={(layout) => {
            setLayout(layout)
          }}
          onBreakpointChange={(breakpoint) => {
            setCurrentBreakpoint(breakpoint)
          }}
        >
          <div key='memory' className='drag-handle '>
            <CardHeader title='Memory' />
            <div className='flex gap-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <span>{memoryInGB} GB</span>
                </div>
              </div>
            </div>
          </div>
          <div key={'configuration'} className='drag-handle '>
            <CardHeader title='Configuration' />
            <div className='flex gap-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <b>CPU Sockets: </b>
                  <span>{cpuSockets}</span>
                </div>
                <div className='flex flex-col'>
                  <b>CPU Cores per Socket: </b>
                  <span>{cpuCoresPerSocket}</span>
                </div>
              </div>
            </div>
          </div>
          <div key='cpu' className='drag-handle '>
            <CardHeader title='CPU' />
            <div className='flex gap-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <b>CPU Usage: </b>
                  <span>{cpuUsage}%</span>
                </div>
              </div>
            </div>
          </div>
          {teamName && (
            <div key='team' className='drag-handle '>
              <CardHeader title='Team' />
              <div className='flex gap-2'>
                <div className='flex flex-1 flex-col gap-2'>
                  <div className='flex flex-col'>
                    <span>
                      {teamName} ({teamValue})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {AdGroup && (
            <div key='AD groups' className='drag-handle '>
              <CardHeader title='AD Group' />
              <div className='flex gap-2'>
                <div className='flex flex-1 flex-col gap-2'>
                  <div className='flex flex-col'>
                    <span>{AdGroup}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {serviceId && (
            <div key='service-id' className='drag-handle '>
              <CardHeader title='Service ID' />
              <div className='flex gap-2'>
                <div className='flex flex-1 flex-col gap-2'>
                  <div className='flex flex-col'>
                    <span>
                      {serviceId} ({serviceValue})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div key='info' className='drag-handle '>
            <CardHeader title='Operating System' />
            <div className='flex gap-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <b>Id: </b>
                  <span>{id}</span>
                </div>
                <div className='flex flex-col'>
                  <b>OS-version: </b>
                  <span>{name}</span>
                </div>
                <div className='flex flex-col'>
                  <b>Version: </b>
                  <span>{version}</span>
                </div>
                <div className='flex flex-col'>
                  <b>Hostname: </b>
                  <span>{hostName}</span>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <b>VMware Tools version: </b>
                  <span>{toolVersion}</span>
                </div>
                <div className='flex flex-col'>
                  <b>Architecture: </b>
                  <span>{architecture}</span>
                </div>
                <div className='flex flex-col'>
                  <b>OS-type: </b>
                  <span>{family}</span>
                </div>
              </div>
            </div>
          </div>
          <div key='controlPanel' className='drag-handle '>
            <CardHeader title='Control Panel' />
            <div className='flex gap-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <b>Power: </b>
                  <span>{powerState === 'poweredOn' ? 'On' : powerState === 'poweredOff' ? 'Off' : 'Unknown'}</span>
                  <b>Actions:</b>
                  {powerState === 'poweredOn' ? null : (
                    <Pill
                      asChild
                      variant={vmActionsColors['powerOn']}
                      className='mt-2 px-3 cursor-pointer'
                      onClick={() => {
                        // TODO: Implement turn on functionality
                      }}
                    >
                      <button type='button'>Turn on</button>
                    </Pill>
                  )}
                  {powerState === 'poweredOff' ? null : (
                    <Pill
                      asChild
                      variant={vmActionsColors['powerOff']}
                      className='mt-2 px-3 cursor-pointer'
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
                    className='mt-2 px-3 cursor-pointer'
                    onClick={() => {
                      // TODO: Implement restart functionality
                    }}
                  >
                    <button type='button'>Restart</button>
                  </Pill>
                  <Pill
                    asChild
                    variant={vmActionsColors['suspend']}
                    className='mt-2 px-3 cursor-pointer'
                    onClick={() => {
                      // TODO: Implement suspend functionality
                    }}
                  >
                    <button type='button'>Suspend</button>
                  </Pill>
                  <Pill
                    asChild
                    variant={vmActionsColors['delete']}
                    className='mt-2 px-3 cursor-pointer'
                    onClick={() => {
                      // TODO: Implement delete functionality
                    }}
                  >
                    <button type='button'>Delete</button>
                  </Pill>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  )
}
