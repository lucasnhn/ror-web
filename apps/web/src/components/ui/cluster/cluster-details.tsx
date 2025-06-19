'use client'

import { cn } from '@/utils/clsxm'
import { User } from 'next-auth'
import React, { useEffect, useRef, useState } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { ExternalLink } from 'lucide-react'
import { Layer, CodeSnippet } from '@ror/react'
import { format } from 'date-fns'
import { enZA } from 'date-fns/locale'
import { useClusterContext } from '@/context/cluster-context'

const standardLayout = [
  { i: 'memory', x: 0, y: 0, w: 6, h: 8, minW: 6, minH: 8 },
  { i: 'tools', x: 6, y: 0, w: 6, h: 8, minW: 6, minH: 6 },
  { i: 'info', x: 12, y: 0, w: 12, h: 8, minW: 9, minH: 8 },
  { i: 'versions', x: 0, y: 8, w: 6, h: 8, minW: 6, minH: 7 },
  { i: 'observed', x: 6, y: 8, w: 6, h: 8, minW: 6, minH: 7 },
  { i: 'prices', x: 12, y: 8, w: 6, h: 8, minW: 6, minH: 4 },
]

interface ClusterDetailsProps {
  user?: User
  className?: string
}

function formatObservationDate(date: string) {
  if (!date || date === '0001-01-01T00:00:00Z' || date === '') {
    return 'Missing…'
  }
  return format(date, 'PPp', {
    locale: enZA,
  })
}

function getHaClusterPlaneValue(nodes: number) {
  if (nodes > 1) {
    return 'Yes'
  } else if (nodes === 1) {
    return 'No'
  } else {
    return ''
  }
}

export const ClusterDetails = ({ user, className }: ClusterDetailsProps) => {
  const { cluster } = useClusterContext()
  const clusterSpec = cluster.kubernetescluster?.spec
  const clusterStatus = cluster.kubernetescluster?.status
  const clusterId = clusterSpec?.data?.clusterId
  const clusterName = cluster.metadata?.name || clusterId

  const cpuData = clusterStatus?.state.cluster.resources.cpu
  const cpu = { capacity: cpuData?.capacity, used: cpuData?.used, percentage: cpuData?.percentage }
  const memoryData = clusterStatus?.state.cluster.resources.memory
  const memory = { capacity: memoryData?.capacity, used: memoryData?.used, percentage: memoryData?.percentage }
  const gpuData = clusterStatus?.state.cluster.resources.gpu
  const gpu = { capacity: gpuData?.capacity, used: gpuData?.used, percentage: gpuData?.percentage }
  const diskData = clusterStatus?.state.cluster.resources.disk
  const disk = { capacity: diskData?.capacity, used: diskData?.used, percentage: diskData?.percentage }

  const tools = {
    argo: clusterStatus?.state.endpoints?.find((endpoint) => endpoint.name === 'argocd')?.address,
    grafana: clusterStatus?.state.endpoints?.find((endpoint) => endpoint.name === 'grafana')?.address,
  }

  const prices = {
    monthly: clusterStatus?.state.cluster.price.monthly || 0,
    yearly: clusterStatus?.state.cluster.price.yearly || 0,
  }

  const lastObserved = clusterStatus?.state.lastUpdated
  const created = clusterStatus?.state.created

  const serverUrl =
    clusterStatus?.state.endpoints?.find((endpoint) => endpoint.name === 'datacenter')?.address || '<missing>'
  const rorLogin = `ror login ${clusterId}`
  const kubectlLogin = `kubectl vsphere login --server=${serverUrl} -u ${user?.email} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${clusterSpec?.data?.workspace} --tanzu-kubernetes-cluster-name ${clusterName}`

  const versions = {
    // TODO: Make sure these are correct names
    agent: clusterStatus?.state.versions?.find((version) => version.name === 'agent') || {
      version: 'Version missing',
      name: 'Agent',
      branch: '',
    },
    kubernetes: clusterStatus?.state.versions?.find((version) => version.name === 'kubernetes') || {
      version: 'Version missing',
      name: 'Kubernetes',
      branch: '',
    },
    nhnTooling: clusterStatus?.state.versions?.find((version) => version.name === 'nhnTooling') || {
      version: 'Version missing',
      name: 'NHN Tooling',
      branch: '',
    },
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const [layoutWidth, setLayoutWidth] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver(([entry]) => {
      setLayoutWidth(entry.contentRect.width)
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  const CardHeader = ({ title }: { title: string }) => {
    return (
      <div className='mb-2'>
        <h4>{title}</h4>
        <hr />
      </div>
    )
  }

  return (
    <div ref={containerRef} className='w-full border rounded-xl p-2'>
      <style>
        {`
            .react-resizable-handle::after { border-color: black; }
            .dark .react-resizable-handle::after { border-color: white; }
            .react-resizable-handle::after { scale: 2; }
            .react-resizable-handle::after { margin-right: 8px; }
            .react-resizable-handle::after { margin-bottom: 8px; }
            .react-grid-item.react-grid-placeholder { background-color: #58acf2; }
            .dark .react-grid-item.react-grid-placeholder { background-color: #3e88c5; }
        `}
      </style>
      {/* TODO: Implement logic to save and reset buttons */}
      {/* <div className='flex gap-2 p-2'>
                <Button>Save layout</Button>
                <Button>Reset to saved</Button>
                <Button>Reset to default</Button>
            </div> */}
      <GridLayout
        className={cn(
          'layout w-full',
          '[&>div]:bg-[var(--r-layer)] [&>div]:rounded-lg [&>div]:p-4 [&>div]:shadow [&>div]:cursor-move',
          className
        )}
        layout={standardLayout}
        cols={24}
        rowHeight={30}
        width={layoutWidth}
        draggableHandle='.drag-handle'
      >
        <div key='memory' className='drag-handle'>
          <CardHeader title='Memory' />

          <div className='flex flex-col gap-2'>
            <div className='flex flex-col'>
              <p className='font-bold'>CPU</p>
              <p>
                {((cpu.percentage === undefined || cpu.percentage === null) &&
                  (cpu.capacity === undefined || cpu.capacity === null)) ||
                ((cpu.percentage === undefined || cpu.percentage === null) &&
                  (cpu.used === undefined || cpu.used === null)) ? (
                  'Data missing'
                ) : (
                  <>
                    {cpu.percentage !== undefined && cpu.percentage !== null && `${cpu.percentage}%`}
                    {cpu.percentage !== undefined &&
                      cpu.percentage !== null &&
                      cpu.used !== undefined &&
                      cpu.capacity !== undefined &&
                      ' '}
                    {cpu.used !== undefined && cpu.capacity !== undefined && `(${cpu.used}m of ${cpu.capacity}m cores)`}
                  </>
                )}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold'>Memory</p>
              <p>
                {((memory.percentage === undefined || memory.percentage === null) &&
                  (memory.capacity === undefined || memory.capacity === null)) ||
                ((memory.percentage === undefined || memory.percentage === null) &&
                  (memory.used === undefined || memory.used === null)) ? (
                  'Data missing'
                ) : (
                  <>
                    {memory.percentage !== undefined && memory.percentage !== null && `${memory.percentage}%`}
                    {memory.percentage !== undefined &&
                      memory.percentage !== null &&
                      memory.used !== undefined &&
                      memory.capacity !== undefined &&
                      ' '}
                    {memory.used !== undefined &&
                      memory.capacity !== undefined &&
                      `(${memory.used} of ${memory.capacity})`}
                  </>
                )}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold'>GPU</p>
              <p>
                {((gpu.percentage === undefined || gpu.percentage === null) &&
                  (gpu.capacity === undefined || gpu.capacity === null)) ||
                ((gpu.percentage === undefined || gpu.percentage === null) &&
                  (gpu.used === undefined || gpu.used === null)) ? (
                  'Data missing'
                ) : (
                  <>
                    {gpu.percentage !== undefined && gpu.percentage !== null && `${gpu.percentage}%`}
                    {gpu.percentage !== undefined &&
                      gpu.percentage !== null &&
                      gpu.used !== undefined &&
                      gpu.capacity !== undefined &&
                      ' '}
                    {gpu.used !== undefined && gpu.capacity !== undefined && `(${gpu.used} of ${gpu.capacity})`}
                  </>
                )}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold'>Disk</p>
              <p>
                {((disk.percentage === undefined || disk.percentage === null) &&
                  (disk.capacity === undefined || disk.capacity === null)) ||
                ((disk.percentage === undefined || disk.percentage === null) &&
                  (disk.used === undefined || disk.used === null)) ? (
                  'Data missing'
                ) : (
                  <>
                    {disk.percentage !== undefined && disk.percentage !== null && `${disk.percentage}%`}
                    {disk.percentage !== undefined &&
                      disk.percentage !== null &&
                      disk.used !== undefined &&
                      disk.capacity !== undefined &&
                      ' '}
                    {disk.used !== undefined && disk.capacity !== undefined && `(${disk.used} of ${disk.capacity})`}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div key='info' className='drag-handle '>
          <CardHeader title='Information' />
          <div className='flex gap-2'>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col'>
                <b>Cluster ID: </b>
                <span>{clusterId}</span>
              </div>
              <div className='flex flex-col'>
                <b>Project: </b>
                <span>{clusterSpec?.data?.project}</span>
              </div>
              <div className='flex flex-col'>
                <b>Workspace: </b>
                <span>{clusterSpec?.data?.workspace}</span>
              </div>
              <div className='flex flex-col'>
                <b>Datacenter: </b>
                <span>{clusterSpec?.data?.datacenter}</span>
              </div>
            </div>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col'>
                <b>Provider: </b>
                <span>{cluster.kubernetescluster?.spec.data?.provider}</span>
              </div>
              <div className='flex flex-col'>
                <b>HA control plane: </b>
                <span>{getHaClusterPlaneValue(clusterSpec?.topology?.controlplane?.replicas || 0)}</span>
              </div>
              <div className='flex flex-col'>
                <b>Egress IP: </b>
                <span>MOCK EGRESS IP</span>
              </div>
            </div>
          </div>
        </div>
        <div key='observed' className='drag-handle'>
          <CardHeader title='Observed' />
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col'>
              <b>Last observed: </b>
              <span>{lastObserved ? formatObservationDate(lastObserved.toString()) : 'Missing…'}</span>
            </div>
            <div className='flex flex-col'>
              <b>Created: </b>
              <span>{created ? formatObservationDate(created.toString()) : 'Missing…'}</span>
            </div>
          </div>
        </div>
        <div key='tools' className='drag-handle'>
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
        </div>
        <div key='versions' className='drag-handle min-h-fit min-w-fit'>
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
        <div key='prices' className='drag-handle'>
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
      </GridLayout>
    </div>
  )
}
