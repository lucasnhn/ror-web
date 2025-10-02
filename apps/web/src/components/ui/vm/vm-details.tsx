'use client'

import { User } from 'next-auth'
import { useVMContext } from '@/context/vm-context'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { cn } from '@/utils/clsxm'
import type { Layout, Layouts } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Pill } from '@/components/shadcn/pill'

const ResponsiveGridLayout = WidthProvider(Responsive)

const standardLayouts: Layouts = {
  lg: [
    { i: 'cpu', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'memory', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'price', x: 12, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'info', x: 0, y: 4, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'networks', x: 12, y: 4, w: 12, h: 16, minW: 9, minH: 16 },
    { i: 'controlPanel', x: 24, y: 0, w: 6, h: 16, minW: 6, minH: 10 },
  ],
  md: [
    { i: 'cpu', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'memory', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'price', x: 12, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'info', x: 0, y: 4, w: 8, h: 8, minW: 6, minH: 8 },
    { i: 'networks', x: 8, y: 4, w: 12, h: 16, minW: 9, minH: 16 },
    { i: 'controlPanel', x: 20, y: 0, w: 6, h: 16, minW: 6, minH: 10 },
  ],
  sm: [
    { i: 'cpu', x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 4 },
    { i: 'memory', x: 4, y: 0, w: 4, h: 4, minW: 4, minH: 4 },
    { i: 'price', x: 8, y: 0, w: 4, h: 4, minW: 4, minH: 4 },
    { i: 'info', x: 0, y: 4, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'networks', x: 0, y: 12, w: 12, h: 16, minW: 9, minH: 16 },
    { i: 'controlPanel', x: 0, y: 28, w: 6, h: 16, minW: 6, minH: 10 },
  ],
  xs: [
    { i: 'cpu', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 4 },
    { i: 'memory', x: 2, y: 0, w: 2, h: 4, minW: 2, minH: 4 },
    { i: 'price', x: 4, y: 0, w: 2, h: 4, minW: 2, minH: 4 },
    { i: 'info', x: 0, y: 4, w: 6, h: 8, minW: 4, minH: 8 },
    { i: 'networks', x: 0, y: 12, w: 6, h: 16, minW: 4, minH: 16 },
    { i: 'controlPanel', x: 0, y: 28, w: 6, h: 16, minW: 6, minH: 10 },
  ],
}

const envColors: Record<string, 'red' | 'emerald' | 'gray' | 'orange' | 'blue'> = {
  powerOff: 'red',
  powerOn: 'emerald',
  undefined: 'gray',
  restart: 'orange',
  suspend: 'blue',
  delete: 'red',
}

interface VMDetailsProps {
  user?: User
  className?: string
}

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
  const [layoutKey, setLayoutKey] = useState(0)
  const [layout, setLayout] = useState<Layout[]>(standardLayouts.lg)
  const [savedLayouts, setSavedLayouts] = useState<Layouts>(standardLayouts)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')

  const cpu = vm?.virtualmachine?.status?.cpu
  const cpuUsage = cpu?.usage
  const cpuSockets = cpu?.resourcevirtualmachinecpuspec?.sockets
  const cpuCoresPerSocket = cpu?.resourcevirtualmachinecpuspec?.corespersocket

  const memory = vm?.virtualmachine?.status?.memory?.resourcevirtualmachinememoryspec?.sizebytes

  const location = vm?.virtualmachine?.status?.location || 'Unknown location'

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
    network.id = network.id || `Network ${index + 1}`
    return network
  })
  const visibleNetworks = listNetworks.slice(0, 2)

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
          <div key='memory' className='drag-handle '>
            <CardHeader title='Memory' />
            <div className='flex gap-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <b>Memory: </b>
                  <span>{memory} bytes</span>
                </div>
              </div>
            </div>
          </div>
          <div key={'price'} className='drag-handle '>
            <CardHeader title='Price' />
            <div className='flex gap-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex flex-col'>
                  <b>Location: </b>
                  <span>{location}</span>
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
                {visibleNetworks.map((network) => (
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
                    Show {networksLength - 2} more <ArrowRight />
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
                  <span>
                    {os_powerstate === 'poweredOn' ? 'On' : os_powerstate === 'poweredOff' ? 'Off' : 'Unknown'}
                  </span>
                  <b>Actions:</b>
                  {os_powerstate === 'poweredOn' ? null : (
                    <Pill
                      asChild
                      variant={envColors['powerOn']}
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
                      variant={envColors['powerOff']}
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
                    variant={envColors['restart']}
                    className='mt-2 px-3 cursor-pointer'
                    onClick={() => {
                      // TODO: Implement restart functionality
                    }}
                  >
                    <button type='button'>Restart</button>
                  </Pill>
                  <Pill
                    asChild
                    variant={envColors['suspend']}
                    className='mt-2 px-3 cursor-pointer'
                    onClick={() => {
                      // TODO: Implement suspend functionality
                    }}
                  >
                    <button type='button'>Suspend</button>
                  </Pill>
                  <Pill
                    asChild
                    variant={envColors['delete']}
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
