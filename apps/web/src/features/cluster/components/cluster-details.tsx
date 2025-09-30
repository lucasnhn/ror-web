'use client'

import { Button } from '@/components/shadcn/button'
import { useClusterContext } from '@/context/cluster-context'
import { cn } from '@/utils/clsxm'
import { getSavedUserPreferenceObject, PREFERENCES_KEY, updateUserPreferenceObject } from '@/utils/user-preferences'
import { Layer } from '@ror/react'
import { ExternalLink } from 'lucide-react'
import { User } from 'next-auth'
import { useEffect, useState } from 'react'
import type { Layout, Layouts } from 'react-grid-layout'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { CodeSnippet } from '../../../components/ui/code-snippet'
import { toast } from 'sonner'
import { formatObservationDate, formatResource } from '../utils/formats'
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
import { standardLayouts } from '../config/cluster-details-layouts'

const ResponsiveGridLayout = WidthProvider(Responsive)

/**
 * Props for the ClusterDetails component.
 *
 * @property {User} [user] - The user associated with the cluster, if available.
 * @property {string} [className] - Optional CSS class name for custom styling.
 */
interface ClusterDetailsProps {
  user?: User
  className?: string
}

/**
 * Displays detailed information about a cluster, including resources, metadata, tools, versions, and pricing.
 *
 * @param user - The current user object, used for personalized cluster access commands.
 * @param className - Optional CSS class for custom styling.
 */
export const ClusterDetails = ({ user, className }: ClusterDetailsProps) => {
  const { cluster } = useClusterContext()
  const [layoutKey, setLayoutKey] = useState(0)
  const [layout, setLayout] = useState<Layout[]>(standardLayouts.lg)
  const [savedLayouts, setSavedLayouts] = useState<Layouts>(standardLayouts)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')

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

  useEffect(() => {
    const preferences = getSavedUserPreferenceObject(PREFERENCES_KEY)
    const layouts = preferences.clusterCards?.layouts || standardLayouts
    setSavedLayouts(layouts)
    setLayout(layouts[currentBreakpoint] || [])
  }, [currentBreakpoint])

  const CardHeader = ({ title }: { title: string }) => {
    return (
      <div className='mb-2'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <hr />
      </div>
    )
  }

  const CardItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className='flex flex-col'>
      <p className='font-bold'>{label}</p>
      <p>{children}</p>
    </div>
  )

  const MemoryCard = () => {
    return (
      <>
        <CardHeader title='Memory' />
        <div className='flex flex-col gap-2'>
          <CardItem label='CPU'>{formatResource('cpu', cpu)}</CardItem>
          <CardItem label='Memory'>{formatResource('memory', memory)}</CardItem>
          <CardItem label='GPU'>{formatResource('gpu', gpu)}</CardItem>
          <CardItem label='Disk'>{formatResource('disk', disk)}</CardItem>
        </div>
      </>
    )
  }

  const InfoCard = () => {
    return (
      <>
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
      </>
    )
  }

  const ObservedCard = () => {
    return (
      <>
        <CardHeader title='Observed' />
        <div className='flex flex-col gap-2'>
          <CardItem label='Last observed:'>
            {lastObserved ? formatObservationDate(lastObserved.toString()) : 'Missing…'}
          </CardItem>
          <CardItem label='Created:'>{created ? formatObservationDate(created.toString()) : 'Missing…'}</CardItem>
        </div>
      </>
    )
  }

  const ToolsCard = () => {
    return (
      <>
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
              <p className='flex overflow-none'>
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
      </>
    )
  }

  const VersionsCard = () => {
    return (
      <>
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
      </>
    )
  }

  const PricesCard = () => {
    return (
      <>
        <CardHeader title='Prices' />
        <div className='flex flex-col gap-2'>
          <span>
            <b>Monthly price: </b> {prices.monthly || 0} kr
          </span>
          <span>
            <b>Yearly price: </b> {prices.yearly || 0} kr
          </span>
        </div>
      </>
    )
  }

  const LayoutButtons = () => {
    return (
      <div className='flex sm:flex-row flex-col gap-2 mb-3'>
        <Button
          onClick={() => {
            const newLayouts = {
              ...savedLayouts,
              [currentBreakpoint]: layout,
            }
            setSavedLayouts(newLayouts)
            updateUserPreferenceObject(PREFERENCES_KEY, {
              clusterCards: {
                layouts: newLayouts,
              },
            })
            toast.info('Layout saved')
          }}
        >
          Save layout
        </Button>
        <Button
          onClick={() => {
            const saved = savedLayouts[currentBreakpoint]
            if (saved) {
              setLayout([...saved])
              setLayoutKey((prev) => prev + 1)
            }
          }}
        >
          Reset to saved
        </Button>
        <Button
          onClick={() => {
            setLayout([...standardLayouts[currentBreakpoint]])
            setSavedLayouts((prev) => ({
              ...prev,
              [currentBreakpoint]: [...standardLayouts[currentBreakpoint]],
            }))
            setLayoutKey((prev) => prev + 1)
          }}
        >
          Reset to default
        </Button>
      </div>
    )
  }

  return (
    <div>
      <LayoutButtons />
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
          <div key='memory' className='drag-handle'>
            <MemoryCard />
          </div>
          <div key='info' className='drag-handle '>
            <InfoCard />
          </div>
          <div key='observed' className='drag-handle'>
            <ObservedCard />
          </div>
          <div key='tools' className='drag-handle'>
            <ToolsCard />
          </div>
          <div key='versions' className='drag-handle min-h-fit min-w-fit'>
            <VersionsCard />
          </div>
          <div key='prices' className='drag-handle'>
            <PricesCard />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  )
}
