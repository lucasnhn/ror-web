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
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Pill } from '@/components/shadcn/pill'
import { vmActionsColors } from '../utils/env-colors'
import { standardLayouts } from '@/features/vms/config/vm-details-layout'
import { Network, VMDetailsProps } from '../utils/vms'
import { GridLayoutWrapper } from '@/components/ui/grid-layout-wrapper'
import { useLayoutPreferences } from '@/hooks/use-layout-preferences'

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
  const { layouts, setLayouts, layoutKey, currentBreakpoint, setCurrentBreakpoint } = useLayoutPreferences(
    'vmDetails',
    standardLayouts
  )
  console.log(currentBreakpoint) // For future use if needed
  const cpu = vm?.virtualmachine?.status?.cpu
  const cpuUsage = cpu?.usage
  const cpuSockets = cpu?.resourcevirtualmachinecpuspec?.sockets
  const cpuCoresPerSocket = cpu?.resourcevirtualmachinecpuspec?.corespersocket
  const memory = vm?.virtualmachine?.status?.memory?.resourcevirtualmachinememoryspec?.sizebytes
  const memoryInGB = ((memory ?? 0) / 1024 ** 3).toFixed(2)
  const os = vm?.virtualmachine?.status?.operatingsystem
  const os_id = os?.id || 'Unknown ID'
  const os_name = os?.name || 'Unknown OS'
  const os_family = os?.family || 'Unknown family'
  const os_version = os?.version || 'Unknown version'
  const os_hostname = os?.hostname || 'Unknown hostname'
  const os_powerstate = os?.powerstate || 'Unknown powerstate'
  const os_toolversion = os?.toolversion || 'Unknown toolversion'
  const os_architecture = os?.architecture || 'Unknown architecture'

  const networks = vm?.virtualmachine?.status?.networks || []
  const networksLength = networks.length
  const listNetworks = networks.map((network, index) => {
    return {
      ...network,
      id: network.id ?? `Network ${index + 1}`,
    } as Network
  })
  const visibleNetworks = listNetworks.slice(0, 2)
  console.log(user)
  return (
    <GridLayoutWrapper
      className={className}
      layouts={layouts}
      layoutKey={layoutKey}
      onLayoutChange={(layout) => setLayouts({ ...layouts, [currentBreakpoint]: layout })}
      onBreakpointChange={setCurrentBreakpoint}
    >
      <div key='memory' className='drag-handle '>
        <CardHeader title='Memory' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex flex-col'>
              <b>Memory: </b>
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
      <div key='info' className='drag-handle '>
        <CardHeader title='Operating System' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex flex-col'>
              <b>Id: </b>
              <span>{os_id}</span>
            </div>
            <div className='flex flex-col'>
              <b>Name: </b>
              <span>{os_name}</span>
            </div>
            <div className='flex flex-col'>
              <b>Version: </b>
              <span>{os_version}</span>
            </div>
            <div className='flex flex-col'>
              <b>Hostname: </b>
              <span>{os_hostname}</span>
            </div>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex flex-col'>
              <b>Tool version: </b>
              <span>{os_toolversion}</span>
            </div>
            <div className='flex flex-col'>
              <b>Architecture: </b>
              <span>{os_architecture}</span>
            </div>
            <div className='flex flex-col'>
              <b>Family: </b>
              <span>{os_family}</span>
            </div>
          </div>
        </div>
      </div>
      <div key='networks' className='drag-handle'>
        <CardHeader title={`Networks (${networksLength})`} />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            {visibleNetworks.map((network: Network) => (
              <div key={network.id} className='mb-2 p-2 border rounded-lg'>
                <div className='flex flex-col'>
                  <b>ID: </b>
                  <span>{network.id}</span>
                </div>
                <div className='flex flex-col'>
                  <b>IPv4: </b>
                  <span>{network.ipv4}</span>
                </div>
                <div className='flex flex-col'>
                  <b>IPv6: </b>
                  <span>{network.ipv6}</span>
                </div>
                <div className='flex flex-col'>
                  <b>MAC-address: </b>
                  <span>{network.mac}</span>
                </div>
                <div className='flex flex-col'>
                  <b>DNS server: </b>
                  <span>{network.dns}</span>
                </div>
              </div>
            ))}
            {networksLength > 2 && (
              <span className='inline-flex items-center gap-1 font-bold'>
                Show {networksLength - 2} more <ArrowRight />{' '}
                {/* This should link to the networks tab where all networks can be shown */}
              </span>
            )}
          </div>
        </div>
      </div>
      <div key='controlPanel' className='drag-handle '>
        <CardHeader title='Control Panel' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex flex-col'>
              <b>Power state: </b>
              <span> {os_powerstate === 'poweredOn' ? 'On' : os_powerstate === 'poweredOff' ? 'Off' : 'Unknown'} </span>
              <b>Actions:</b>
              {os_powerstate === 'poweredOn' ? null : (
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
              {os_powerstate === 'poweredOff' ? null : (
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
    </GridLayoutWrapper>
  )
}
