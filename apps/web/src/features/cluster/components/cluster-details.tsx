'use client'

import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { Button } from '@/components/shadcn/button'
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import { toast } from 'sonner'
import { User } from 'next-auth'
import { ExternalLink } from 'lucide-react'
import { Layer } from '@ror/react'
import { useClusterContext } from '@/context/cluster-context'
import { CardHeader, CardItem } from '@/components/ui/grid-layout-card'
import { CodeSnippet } from '@/components/ui/code-snippet'
import {
  getClusterId,
  getClusterResource,
  getCreated,
  getDatacenter,
  getHaClusterPlaneValue,
  getKubectlLogin,
  getLastObserved,
  getPrices,
  getProject,
  getProvider,
  getRorLogin,
  getTools,
  getVersions,
  getWorkspace,
} from '../utils/cluster'
import { formatObservationDate, formatResource } from '../utils/formats'
import { useLayoutPreferences } from '@/hooks/use-layout-preferences'
import { type GridStackNode } from 'gridstack'
import { createRoot } from 'react-dom/client'

interface ClusterDetailsProps {
  user?: User
  className?: string
}

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

export const ClusterDetails = ({ user, className }: ClusterDetailsProps) => {
  const { cluster } = useClusterContext()
  const gridRef = useRef<GridStack | null>(null)
  const gridContainerRef = useRef<HTMLDivElement | null>(null)

  const [layout, setLayout] = useState<{ id: string; x: number; y: number; w: number; h: number }[]>([])
  const [savedLayout, setSavedLayout] = useState<{ id: string; x: number; y: number; w: number; h: number }[] | null>(
    null
  )

  const clusterId = getClusterId(cluster)
  const cpu = getClusterResource(cluster, 'cpu')
  const memory = getClusterResource(cluster, 'memory')
  const gpu = getClusterResource(cluster, 'gpu')
  const disk = getClusterResource(cluster, 'disk')
  const tools = getTools(cluster)
  const prices = getPrices(cluster)
  const lastObserved = getLastObserved(cluster)
  const created = getCreated(cluster)
  const rorLogin = getRorLogin(cluster)
  const kubectlLogin = getKubectlLogin(cluster, user?.email || '<user-email missing>')
  const versions = getVersions(cluster)
  const project = getProject(cluster)
  const workspace = getWorkspace(cluster)
  const datacenter = getDatacenter(cluster)
  const provider = getProvider(cluster)

  const MemoryCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Memory' />
        <div className='flex flex-col gap-2'>
          <CardItem label='CPU'>{formatResource('cpu', cpu)}</CardItem>
          <CardItem label='Memory'>{formatResource('memory', memory)}</CardItem>
          <CardItem label='GPU'>{formatResource('gpu', gpu)}</CardItem>
          <CardItem label='Disk'>{formatResource('disk', disk)}</CardItem>
        </div>
      </div>
    ),
    [cpu, memory, gpu, disk]
  )

  const InfoCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Information' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <CardItem label='Cluster ID:'>{clusterId}</CardItem>
            <CardItem label='Project:'>{project}</CardItem>
            <CardItem label='Workspace:'>{workspace}</CardItem>
            <CardItem label='Datacenter:'>{datacenter}</CardItem>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <CardItem label='Provider:'>{provider}</CardItem>
            <CardItem label='HA control plane:'>{getHaClusterPlaneValue(cluster)}</CardItem>
            <CardItem label='Egress IP:'>MOCK EGRESS IP</CardItem>
          </div>
        </div>
      </div>
    ),
    [cluster, clusterId, datacenter, provider, project, workspace]
  )

  const ObservedCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Observed' />
        <div className='flex flex-col gap-2'>
          <CardItem label='Last observed:'>
            {lastObserved ? formatObservationDate(lastObserved.toString()) : 'Missing…'}
          </CardItem>
          <CardItem label='Created:'>{created ? formatObservationDate(created.toString()) : 'Missing…'}</CardItem>
        </div>
      </div>
    ),
    [lastObserved, created]
  )

  const ToolsCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Tools' />
        <div className='flex flex-col gap-2'>
          <section className='flex flex-col'>
            {tools.argo ? (
              <a
                onClick={(e) => e.stopPropagation()}
                href={`https://${tools.argo}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex gap-2 font-bold text-blue-500 w-fit'
              >
                <span>ArgoCD</span>
                <ExternalLink className='w-5 h-5' />
              </a>
            ) : (
              <p className='flex [@container(max-width:360px)]:flex-col overflow-none'>
                <span className='font-bold'>ArgoCD &nbsp;</span>
                <span>missing ...</span>
              </p>
            )}
          </section>
          <section className='flex flex-col'>
            {tools.grafana ? (
              <a
                onClick={(e) => e.stopPropagation()}
                href={`https://${tools.grafana}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex gap-2 font-bold text-blue-500 w-fit'
              >
                <span>Grafana</span>
                <ExternalLink className='w-5 h-5' />
              </a>
            ) : (
              <p className='flex [@container(max-width:360px)]:flex-col overflow-none'>
                <span className='font-bold'>Grafana &nbsp;</span>
                <span>missing ...</span>
              </p>
            )}
          </section>
          <Layer level={2}>
            <CodeSnippet type='single'>{rorLogin}</CodeSnippet>
          </Layer>
          <Layer level={2}>
            <CodeSnippet type='single'>{kubectlLogin}</CodeSnippet>
          </Layer>
        </div>
      </div>
    ),
    [tools, rorLogin, kubectlLogin]
  )

  const VersionsCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Versions' />
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <b>Tooling version: </b>
            <span>{versions.nhnTooling.version}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <b>Agent version: </b>
            <span>{versions.agent.version}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <b>Kubernetes version: </b>
            <span>{versions.kubernetes.version}</span>
          </div>
        </div>
      </div>
    ),
    [versions]
  )

  const PricesCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Prices' />
        <div className='flex flex-col gap-2'>
          <span>
            <b>Monthly price: </b> {prices.monthly || 0} kr
          </span>
          <span>
            <b>Yearly price: </b> {prices.yearly || 0} kr
          </span>
        </div>
      </div>
    ),
    [prices]
  )

  const {
    // layouts,
    // setLayouts,
    layoutKey,
    // currentBreakpoint,
    // setCurrentBreakpoint,
    saveLayouts,
    resetToSaved,
    resetToDefault,
    getCurrentLayouts,
  } = useLayoutPreferences('clusterCards', layout)

  const items: WidgetItem[] = useMemo(
    () => [
      { id: 'memory', x: 5, y: 0, w: 2, h: 10, minW: 2, minH: 10, content: <MemoryCard /> },
      { id: 'info', x: 0, y: 0, w: 5, h: 10, minW: 3, minH: 10, content: <InfoCard /> },
      { id: 'observed', x: 4, y: 10, w: 3, h: 10, minW: 2, minH: 6, content: <ObservedCard /> },
      { id: 'tools', x: 7, y: 0, w: 3, h: 10, minW: 2, minH: 8, content: <ToolsCard /> },
      { id: 'versions', x: 0, y: 10, w: 4, h: 10, minW: 2, minH: 9, content: <VersionsCard /> },
      { id: 'prices', x: 7, y: 10, w: 3, h: 10, minW: 2, minH: 4, content: <PricesCard /> },
    ],
    [MemoryCard, InfoCard, ObservedCard, ToolsCard, VersionsCard, PricesCard]
  )

  useEffect(() => {
    const container = gridContainerRef.current
    if (!container) return

    container.innerHTML = '' // Clear existing DOM

    const prefs = getCurrentLayouts()
    const savedLayouts = prefs.clusterCards?.layouts
    const savedMap: Record<string, { x: number; y: number; w: number; h: number }> = {}

    if (savedLayouts && typeof savedLayouts === 'object' && Array.isArray(savedLayouts.lg)) {
      for (const l of savedLayouts.lg) {
        if (!l) continue
        savedMap[String(l.i)] = { x: l.x, y: l.y, w: l.w, h: l.h }
      }
    }

    const grid = GridStack.init(
      {
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
  }, [layoutKey]) // 🔥 key change: makes GridStack rebuild when layoutKey changes

  // useEffect(() => {
  //   const container = gridContainerRef.current
  //   if (!container) return

  //   container.innerHTML = ''

  //   const prefs = getCurrentLayouts()
  //   const savedLayouts = prefs.clusterCards?.layouts
  //   const savedMap: Record<string, { x: number; y: number; w: number; h: number }> = {}

  //   if (savedLayouts && typeof savedLayouts === 'object' && Array.isArray(savedLayouts.lg)) {
  //     for (const l of savedLayouts.lg) {
  //       if (!l) continue
  //       savedMap[String(l.i)] = { x: l.x, y: l.y, w: l.w, h: l.h }
  //     }
  //   }

  //   const grid = GridStack.init(
  //     {
  //       float: true,
  //       cellHeight: '30px',
  //       minRow: 1,
  //       margin: 5,
  //       staticGrid: false,
  //       disableDrag: false,
  //       disableResize: false,
  //     },
  //     container
  //   )

  //   gridRef.current = grid

  //   items.forEach((item) => {
  //     const fromSaved = savedMap[item.id]

  //     const node: GridStackNode = {
  //       x: fromSaved?.x ?? item.x,
  //       y: fromSaved?.y ?? item.y,
  //       w: fromSaved?.w ?? item.w,
  //       h: fromSaved?.h ?? item.h,
  //       minW: item.minW,
  //       minH: item.minH,
  //       id: item.id,
  //     }

  //     const el = grid.addWidget(node)
  //     const contentEl = el.querySelector(
  //       '.grid-stack-item-content'
  //     ) as HTMLDivElement

  //     let root = reactRoots.get(contentEl)
  //     if (!root) {
  //       root = createRoot(contentEl)
  //       reactRoots.set(contentEl, root)
  //     }
  //     root.render(item.content)
  //   })

  //   const handleChange = () => {
  //     const nodes = grid.engine.nodes
  //     const newLayout = nodes.map((n) => ({
  //       id: String(n.id ?? ''),
  //       x: n.x ?? 0,
  //       y: n.y ?? 0,
  //       w: n.w ?? 0,
  //       h: n.h ?? 0,
  //     }))
  //     setLayout(newLayout)
  //   }

  // grid.on('change', handleChange)
  // grid.on('dragstop', handleChange)
  // grid.on('resizestop', handleChange)

  // // optional: capture initial layout
  // handleChange()

  // return () => {
  //   grid.off('change')
  //   grid.off('dragstop')
  //   grid.off('resizestop')
  //   grid.destroy(false)
  //   gridRef.current = null
  // }
  // }, [])

  const LayoutButtons = () => (
    <div className='flex sm:flex-row flex-col gap-2 mb-3'>
      <Button
        onClick={() => {
          saveLayouts(layout)
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
      <section ref={gridContainerRef} className='border rounded-lg' />
    </div>
  )
}
