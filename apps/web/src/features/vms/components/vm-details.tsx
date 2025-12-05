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

import { Button } from '@/components/shadcn/button'
import { Pill } from '@/components/shadcn/pill'
import { CardHeader } from '@/components/ui/grid-layout-card'
import { useVMContext } from '@/context/vm-context'
import { standardLayouts } from '@/features/vms/config/vm-details-layout'
import { useLayoutPreferences } from '@/hooks/use-layout-preferences'
import { StoredLayoutItem } from '@/utils/layout-item'
import { GridStack, GridStackNode } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { toast } from 'sonner'
import { vmActionsColors } from '../utils/env-colors'
import {
  getAdGroup,
  getSpecCoresPerSocket,
  getSpecMemory,
  getSpecSockets,
  getStatusCpuUsage,
  getTeamName,
  getTeamValue,
  getVmArchitecture,
  getVmFamily,
  getVmHostName,
  getVmName,
  getVmOperatingSystemId,
  getVmPowerState,
  getVmToolVersion,
  getVmVersion,
  serviceIdDescription,
  serviceIdValue,
  VMDetailsProps,
} from '../utils/vms'
import { breakpoints } from '@/components/ui/grid-layout-wrapper'

type WidgetItem = {
  id: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  content: React.ReactNode
}

const reactRoots = new WeakMap<Element, ReturnType<typeof createRoot>>()

export const VMDetails = ({ user, className }: VMDetailsProps) => {
  const { vm } = useVMContext()
  const gridRef = useRef<GridStack | null>(null)
  const gridContainerRef = useRef<HTMLDivElement | null>(null)
  const [layout, setLayout] = useState<{ id: string; x: number; y: number; w: number; h: number }[]>([])

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

  const teamName = getTeamName(vm)
  const teamValue = getTeamValue(vm)
  const AdGroup = getAdGroup(vm)
  const serviceId = serviceIdDescription(vm)
  const serviceValue = serviceIdValue(vm)

  console.log(user)

  const MemoryCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Memory' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex flex-col'>
              <span>{memoryInGB} GB</span>
            </div>
          </div>
        </div>
      </div>
    ),
    [memoryInGB]
  )

  const ConfigurationCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
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
    ),
    [cpuCoresPerSocket, cpuSockets]
  )

  const CpuCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
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
    ),
    [cpuUsage]
  )

  const TeamCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Team' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex flex-col'>
              <span>
                {teamValue} ({teamName})
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    [teamName, teamValue]
  )

  const AdGroupsCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='AD Group' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex flex-col'>
              <span>{AdGroup}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    [AdGroup]
  )

  const ServiceIdCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
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
    ),
    [serviceId, serviceValue]
  )

  const InfoCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
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
    ),
    [architecture, family, hostName, id, name, toolVersion, version]
  )

  const ControlPanelCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
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
    ),
    [powerState]
  )

  const {
    layoutKey,
    currentBreakpoint,
    setCurrentBreakpoint,
    saveLayouts,
    resetToSaved,
    resetToDefault,
    getCurrentLayouts,
  } = useLayoutPreferences('vmDetails', layout)

  const handleResize = () => {
    const width = window.innerWidth
    if (width >= breakpoints.xl) {
      setCurrentBreakpoint('xl')
    } else if (width >= breakpoints.lg) {
      setCurrentBreakpoint('lg')
    } else if (width >= breakpoints.md) {
      setCurrentBreakpoint('md')
    } else if (width >= breakpoints.sm) {
      setCurrentBreakpoint('sm')
    } else {
      setCurrentBreakpoint('xs')
    }
  }

  const items: WidgetItem[] = useMemo(() => {
    const baseLayout = standardLayouts[currentBreakpoint] || []

    const layoutMap = baseLayout.reduce(
      (acc, l) => {
        acc[l.i] = l
        return acc
      },
      {} as Record<string, StoredLayoutItem>
    )

    return [
      { id: 'cpu', ...layoutMap['cpu'], content: <CpuCard /> },
      { id: 'memory', ...layoutMap['memory'], content: <MemoryCard /> },
      { id: 'configuration', ...layoutMap['configuration'], content: <ConfigurationCard /> },
      { id: 'team', ...layoutMap['team'], content: <TeamCard /> },
      { id: 'ad-groups', ...layoutMap['ad-groups'], content: <AdGroupsCard /> },
      { id: 'service-id', ...layoutMap['service-id'], content: <ServiceIdCard /> },
      { id: 'info', ...layoutMap['info'], content: <InfoCard /> },
      { id: 'control-panel', ...layoutMap['control-panel'], content: <ControlPanelCard /> },
    ]
  }, [
    currentBreakpoint,
    CpuCard,
    MemoryCard,
    ConfigurationCard,
    TeamCard,
    AdGroupsCard,
    ServiceIdCard,
    InfoCard,
    ControlPanelCard,
  ])

  useEffect(() => {
    const container = gridContainerRef.current
    if (!container) return

    container.innerHTML = '' // Clear existing DOM

    const prefs = getCurrentLayouts()
    const savedLayouts = prefs.vmDetails?.layouts as Record<
      string,
      { i: string; x: number; y: number; w: number; h: number }[]
    >
    const savedMap: Record<string, { x: number; y: number; w: number; h: number }> = {}

    const layoutForBreakpoint =
      savedLayouts?.[currentBreakpoint] ?? standardLayouts[currentBreakpoint] ?? standardLayouts.lg

    console.log('Loading layout for:', currentBreakpoint, layoutForBreakpoint)

    if (Array.isArray(layoutForBreakpoint)) {
      for (const l of layoutForBreakpoint) {
        if (!l) continue
        savedMap[String(l.i)] = { x: l.x, y: l.y, w: l.w, h: l.h }
      }
    }

    const grid = GridStack.init(
      {
        column: 12,
        float: true,
        cellHeight: '30px',
        minRow: 1,
        margin: 5,
        staticGrid: false,
        disableDrag: false,
        disableResize: false,
      },
      container
    )

    gridRef.current = grid

    items.forEach((item) => {
      const fromSaved = savedMap[item.id]

      const node: GridStackNode = {
        x: fromSaved?.x ?? item.x,
        y: fromSaved?.y ?? item.y,
        w: fromSaved?.w ?? item.w,
        h: fromSaved?.h ?? item.h,
        minW: item.minW,
        minH: item.minH,
        id: item.id,
      }

      const el = grid.addWidget(node)
      const contentEl = el.querySelector('.grid-stack-item-content') as HTMLDivElement

      let root = reactRoots.get(contentEl)
      if (!root) {
        root = createRoot(contentEl)
        reactRoots.set(contentEl, root)
      }
      root.render(item.content)
    })

    const handleChange = () => {
      const nodes = grid.engine.nodes
      const newLayout = nodes.map((n) => ({
        id: String(n.id ?? ''),
        x: n.x ?? 0,
        y: n.y ?? 0,
        w: n.w ?? 0,
        h: n.h ?? 0,
      }))
      setLayout(newLayout)
    }

    grid.on('change', handleChange)
    grid.on('dragstop', handleChange)
    grid.on('resizestop', handleChange)

    handleChange() // capture initial layout

    return () => {
      grid.off('change')
      grid.off('dragstop')
      grid.off('resizestop')
      grid.destroy(false)
      gridRef.current = null
    }
  }, [layoutKey, currentBreakpoint])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const LayoutButtons = () => (
    <div className='flex sm:flex-row flex-col gap-2 mb-3'>
      <Button
        onClick={() => {
          const layoutMap = {
            [currentBreakpoint]: layout.map((l) => ({
              i: l.id,
              x: l.x,
              y: l.y,
              w: l.w,
              h: l.h,
            })),
          }

          saveLayouts(layoutMap)
          toast.info('Layout saved')
        }}
      >
        Save layout
      </Button>
      <Button onClick={resetToSaved}>Reset to saved</Button>
      <Button onClick={resetToDefault}>Reset to default</Button>
    </div>
  )

  return (
    <div>
      <LayoutButtons />
      <section className='border rounded-lg p-1'>
        <div ref={gridContainerRef} />
      </section>
      {/* <GridLayoutWrapper
        className={className}
        layouts={layouts}
        layoutKey={layoutKey}
        onLayoutChange={(layout) => setLayouts({ ...layouts, [currentBreakpoint]: layout as RGLLayoutItem[] })}
        onBreakpointChange={setCurrentBreakpoint}
      >
        <div key='memory' className='drag-handle '>
          <MemoryCard />
        </div>
        <div key='configuration' className='drag-handle '>
          <ConfigurationCard />
        </div>
        <div key='cpu' className='drag-handle '>
          <CpuCard />
        </div> */}
      {/* {teamValue && ( */}
      {/* <div key='team' className='drag-handle '>
          <TeamCard />
        </div> */}
      {/* )} */}
      {/* {AdGroup && ( */}
      {/* <div key='ad-groups' className='drag-handle '>
          <AdGroupsCard />
        </div> */}
      {/* )} */}
      {/* {serviceId && ( */}
      {/* <div key='service-id' className='drag-handle '>
          <ServiceIdCard />
        </div> */}
      {/* )} */}
      {/* <div key='info' className='drag-handle '>
          <InfoCard />
        </div>
        <div key='control-panel' className='drag-handle '>
          <ControlPanelCard />
        </div>
      </GridLayoutWrapper> */}
    </div>
  )
}
