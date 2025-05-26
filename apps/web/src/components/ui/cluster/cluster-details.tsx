'use client'

import { getCommonClusterTools } from '@/features/clusters/utils/tools'
import { cn } from '@/utils/clsxm'
import { User } from 'next-auth'
import { type Cluster } from '@ror/js-api-client'
import React, { useEffect, useRef, useState } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { ExternalLink } from 'lucide-react'
import { Layer, CodeSnippet } from '@ror/react'
import { format } from 'date-fns'
import { enZA } from 'date-fns/locale'
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'
import { convertBytes } from '@/utils/bytes'

const standardLayout = [
  { i: 'metrics', x: 0, y: 0, w: 6, h: 8, minW: 6, minH: 8 },
  { i: 'tools', x: 6, y: 0, w: 6, h: 8, minW: 6, minH: 6 },
  { i: 'info', x: 12, y: 0, w: 12, h: 8, minW: 9, minH: 8 },
  { i: 'accessGroups', x: 0, y: 8, w: 6, h: 8, minW: 6, minH: 4 },
  { i: 'versions', x: 6, y: 8, w: 6, h: 8, minW: 6, minH: 7 },
  { i: 'observed', x: 12, y: 8, w: 6, h: 8, minW: 6, minH: 7 },
  { i: 'prices', x: 18, y: 8, w: 6, h: 8, minW: 6, minH: 4 },
]

interface ClusterDetailsProps {
  cluster: Cluster
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

function getHaClusterPlaneValue(cluster: Cluster) {
  const nodes = cluster.topology.controlPlane.nodes

  if (Array.isArray(nodes) && nodes.length > 1) {
    return 'Yes'
  } else if (Array.isArray(nodes) && nodes.length === 1) {
    return 'No'
  } else {
    return ''
  }
}

export const ClusterDetails = ({ cluster, user, className }: ClusterDetailsProps) => {
  const metrics = cluster.metrics

  const firstObserved = formatObservationDate(cluster.firstObserved)
  const lastObserved = formatObservationDate(cluster.lastObserved)
  const created = formatObservationDate(cluster.created)

  const { argo, grafana } = getCommonClusterTools(cluster)
  const rorLogin = `ror login ${cluster.clusterId}`
  const serverUrl =
    cluster.workspace.datacenter.apiEndpoint.length > 0 ? cluster.workspace.datacenter.apiEndpoint : '<missing>'
  const kubectlLogin = `kubectl vsphere login --server=${serverUrl} -u ${user?.email} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${cluster?.workspace?.name} --tanzu-kubernetes-cluster-name ${cluster?.clusterName}`

  const accessGroups = cluster.acl.accessGroups

  const nhnToolingVersion = cluster.versions.nhnTooling.version
  const nhnToolingBranch = cluster.versions.nhnTooling.branch
  const nhnToolingValue =
    nhnToolingVersion !== 'Missing ...' ? `${nhnToolingVersion} (${nhnToolingBranch})` : 'Missing …'

  const agentVersion = cluster.versions.agent?.version
  const agentSha = cluster.versions.agent?.sha
  const agentValue = `${agentVersion} (${agentSha})`

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
        <div key='metrics' className='drag-handle'>
          <CardHeader title='Metrics' />

          <div className='flex flex-col gap-2'>
            <div className='flex flex-col'>
              <b>CPU consumption: </b>
              <span>
                {metrics.cpuConsumed}m of {metrics.cpu} cores - {metrics.cpuPercentage}%
              </span>
            </div>
            <div className='flex flex-col'>
              <b>Memory consumption: </b>
              <span>
                {convertBytes(metrics.memoryConsumed, { useBinaryUnits: true, includeUnit: false })} of{' '}
                {convertBytes(metrics.memory, { useBinaryUnits: true })} - {metrics.memoryPercentage}%
              </span>
            </div>
            <div className='flex flex-col'>
              <b>Nodes: </b>
              <span>
                {metrics.nodeCount} - {metrics.nodePoolCount} node pools
              </span>
            </div>
            <div className='flex flex-col'>
              <b>Clusters: </b>
              <span>{metrics.clusterCount} cluster</span>
            </div>
          </div>
        </div>
        <div key='info' className='drag-handle '>
          <CardHeader title='Information' />
          <div className='flex gap-2'>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col'>
                <b>Cluster ID: </b>
                <span>{cluster.clusterId}</span>
              </div>
              <div className='flex flex-col'>
                <b>Project: </b>
                <span>{cluster.metadata.project?.name}</span>
              </div>
              <div className='flex flex-col'>
                <b>Workspace: </b>
                <span>{cluster.workspace.name}</span>
              </div>
              <div className='flex flex-col'>
                <b>Datacenter: </b>
                <span>{cluster.workspace.datacenter.name}</span>
              </div>
            </div>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col'>
                <b>Provider: </b>
                <span>{cluster.workspace.datacenter.provider}</span>
              </div>
              <div className='flex flex-col'>
                <b>HA control plane: </b>
                <span>{getHaClusterPlaneValue(cluster)}</span>
              </div>
              <div className='flex flex-col'>
                <b>Egress IP: </b>
                <span>{cluster.topology?.egressIp}</span>
              </div>
            </div>
          </div>
        </div>
        <div key='observed' className='drag-handle'>
          <CardHeader title='Observed' />
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col'>
              <b>First observed: </b>
              <span>{firstObserved}</span>
            </div>
            <div className='flex flex-col'>
              <b>Last observed: </b>
              <span>{lastObserved}</span>
            </div>
            <div className='flex flex-col'>
              <b>Created: </b>
              <span>{created}</span>
            </div>
          </div>
        </div>
        <div key='tools' className='drag-handle'>
          <CardHeader title='Tools' />
          <div className='flex flex-col gap-2'>
            <section className='flex flex-col'>
              {argo ? (
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={`https://${argo}`}
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

              {grafana ? (
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={`https://${grafana}`}
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
        <div key='accessGroups' className='drag-handle'>
          <CardHeader title='Access groups' />
          <ScrollArea className='w-full h-[calc(100%-64px)] whitespace-nowrap'>
            <div className='flex flex-col w-max space-x-4'>
              {accessGroups.map((group: string, index: number) => (
                <div key={index} className='overflow-hidden rounded-md'>
                  <span>{group}</span>
                </div>
              ))}
            </div>
            <ScrollBar orientation='vertical' />
          </ScrollArea>
        </div>
        <div key='versions' className='drag-handle min-h-fit min-w-fit'>
          <CardHeader title='Versions' />
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <b>Tooling version: </b>
              <span>{nhnToolingValue}</span>
            </div>
            <div className='flex flex-col gap-1'>
              <b>Agent version: </b>
              <span>{agentValue}</span>
            </div>
            <div className='flex flex-col gap-1'>
              <b>Kubernetes version: </b>
              <span>{cluster.versions.kubernetes}</span>
            </div>
          </div>
        </div>
        <div key='prices' className='drag-handle'>
          <CardHeader title='Prices' />
          <div className='flex flex-col gap-2'>
            <span>
              <b>Monthly price: </b> {metrics.priceMonth} kr
            </span>
            <span>
              <b>Yearly price: </b> {metrics.priceYear} kr
            </span>
          </div>
        </div>
      </GridLayout>
    </div>
  )
}
