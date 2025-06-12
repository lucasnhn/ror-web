'use client'

import { cn } from '@/utils/clsxm'
import { User } from 'next-auth'
import type { KubernetesCluster } from '@ror/js-api-client'
import React, { useEffect, useRef, useState } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { ExternalLink } from 'lucide-react'
import { Layer, CodeSnippet } from '@ror/react'
import { format } from 'date-fns'
import { enZA } from 'date-fns/locale'

const standardLayout = [
  { i: 'metrics', x: 0, y: 0, w: 6, h: 8, minW: 6, minH: 8 },
  { i: 'tools', x: 6, y: 0, w: 6, h: 8, minW: 6, minH: 6 },
  { i: 'info', x: 12, y: 0, w: 12, h: 8, minW: 9, minH: 8 },
  { i: 'versions', x: 0, y: 8, w: 6, h: 8, minW: 6, minH: 7 },
  { i: 'observed', x: 6, y: 8, w: 6, h: 8, minW: 6, minH: 7 },
  { i: 'prices', x: 12, y: 8, w: 6, h: 8, minW: 6, minH: 4 },
]

interface ClusterDetailsProps {
  cluster: KubernetesCluster
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

export const ClusterDetails = ({ cluster, user, className }: ClusterDetailsProps) => {
  const clusterSpec = cluster.kubernetescluster?.spec
  const clusterStatus = cluster.kubernetescluster?.status

  const cpu = clusterStatus?.clusterStatus.cpu || { capacity: 0, used: 0, percentage: 0 }
  const memory = clusterStatus?.clusterStatus.memory || { capacity: 0, used: 0, percentage: 0 }
  const nodes = clusterStatus?.clusterStatus.nodes || 0
  const nodePools = clusterStatus?.clusterStatus.nodePools || 0

  const argocd = clusterSpec?.endpoints?.find(
    (endpoint: { type?: string | null; address?: string | null }) => endpoint.type === 'argocd'
  )?.address
  const grafana = clusterSpec?.endpoints?.find(
    (endpoint: { type?: string | null; address?: string | null }) => endpoint.type === 'grafana'
  )?.address

  const prices = clusterStatus?.clusterStatus.price || { monthly: 0, yearly: 0 }

  const firstObserved = 'MOCK TIME' // TODO: MOCK firstObserved
  const lastObserved = formatObservationDate(cluster.kubernetescluster?.status?.lastObservedTime || '')
  const created = formatObservationDate(cluster.kubernetescluster?.status?.createdTime || '')

  const rorLogin = `ror login ${cluster.kubernetescluster?.spec.clusterId}`
  const serverUrl = 'MOCK SERVER URL' // TODO: MOCK server URL
  const kubectlLogin = `kubectl vsphere login --server=${serverUrl} -u ${user?.email} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${'MOCK WORKSPACE'} --tanzu-kubernetes-cluster-name ${cluster.metadata.name}` // TODO: MOCK WORKSPACE

  const versions = {
    agent: { version: 'MOCK agent', sha: 'MOCK agent sha' },
    kubernetes: 'MOCK kubernetes',
    nhnTooling: { version: 'MOCK nhnTooling', branch: 'MOCK nhnTooling branch' },
  } // TODO: MOCK versions
  const nhnToolingVersion = versions.nhnTooling.version // TODO: MOCK tooling
  const nhnToolingBranch = versions.nhnTooling.branch // TODO: MOCK tooling
  const nhnToolingValue =
    nhnToolingVersion !== 'Missing ...' ? `${nhnToolingVersion} (${nhnToolingBranch})` : 'Missing …' // TODO: MOCK tooling
  const agentVersion = versions.agent?.version // TODO: MOCK tooling
  const agentSha = versions.agent?.sha // TODO: MOCK tooling
  const agentValue = `${agentVersion} (${agentSha})` // TODO: MOCK tooling

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
                {cpu.percentage}% ({cpu.used}m of {cpu.capacity}m cores)
              </span>
            </div>
            <div className='flex flex-col'>
              <b>Memory consumption: </b>
              {memory.percentage}% ({memory.used} of {memory.capacity})
            </div>
            <div className='flex flex-col'>
              <b>Nodes: </b>
              <span>
                {nodes} ({nodePools} node pool{nodePools > 1 ? 's' : ''})
              </span>
            </div>
          </div>
        </div>
        <div key='info' className='drag-handle '>
          <CardHeader title='Information' />
          <div className='flex gap-2'>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col'>
                <b>Cluster ID: </b>
                <span>{clusterSpec.clusterId}</span>
              </div>
              <div className='flex flex-col'>
                <b>Project: </b>
                <span>{clusterSpec.project}</span>
              </div>
              <div className='flex flex-col'>
                <b>Workspace: </b>
                <span>MOCK WORKSPACE</span>
              </div>
              <div className='flex flex-col'>
                <b>Datacenter: </b>
                <span>MOCK DATACENTER</span>
              </div>
            </div>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col'>
                <b>Provider: </b>
                <span>{cluster.kubernetescluster?.spec.provider}</span>
              </div>
              <div className='flex flex-col'>
                <b>HA control plane: </b>
                <span>{getHaClusterPlaneValue(nodes)}</span>
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
              {argocd ? (
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={`https://${argocd}`}
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
              <span>{versions.kubernetes}</span>
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
