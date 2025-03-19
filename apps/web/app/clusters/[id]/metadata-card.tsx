'use client'
import type { Cluster } from '@ror/js-api-client'
import clsxm from '@/utils/clsxm'
import { Tile, CodeSnippet, Layer, DefinitionDescription, DefinitionList, DefinitionTerm, Tag } from '@ror/react'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale/nb'
import { EnvironmentTag } from '@/components/common/environment-tag'

interface ClusterMetadataCardProps {
  cluster: Cluster
  className?: string
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

function formatObservationDate(date: string) {
  if (!date || date === '0001-01-01T00:00:00Z' || date === '') {
    return 'Missing…'
  }
  return format(date, 'PPp', {
    locale: nb,
  })
}

export function ClusterMetadataCard({ cluster, className }: ClusterMetadataCardProps) {
  const { clusterId, clusterName, workspace, metadata } = cluster

  const classes = clsxm('p-5', className)

  const firstObserved = formatObservationDate(cluster.firstObserved)
  const lastObserved = formatObservationDate(cluster.lastObserved)
  const created = formatObservationDate(cluster.created)

  return (
    <Tile className={classes}>
      <div className=''>
        <h3 className='heading-01 pb-3 mb-5 border-b border-b-(--r-border-subtle)'>Information</h3>
        <DefinitionList className='grid-cols-4'>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Project</DefinitionTerm>
            <DefinitionDescription>{metadata?.project?.name ?? 'Missing…'}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Cluster ID</DefinitionTerm>
            <DefinitionDescription>
              <Layer level={1}>
                <CodeSnippet type='inline'>{clusterId}</CodeSnippet>
              </Layer>
            </DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Cluster Name</DefinitionTerm>
            <DefinitionDescription>{clusterName}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Workspace</DefinitionTerm>
            <DefinitionDescription>{workspace.name}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Datacenter</DefinitionTerm>
            <DefinitionDescription>{workspace.datacenter.name}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Provider</DefinitionTerm>
            <DefinitionDescription>{workspace.datacenter.provider}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>HA control plane</DefinitionTerm>
            <DefinitionDescription>{getHaClusterPlaneValue(cluster)}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Environment</DefinitionTerm>
            <DefinitionDescription>
              <EnvironmentTag environment={cluster.environment} size='sm' variant='readonly'>
                {cluster.environment}
              </EnvironmentTag>
            </DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Egress IP</DefinitionTerm>
            <DefinitionDescription>
              {typeof cluster.topology.egressIp === 'string' && cluster.topology.egressIp.length > 0 ? (
                <Layer level={1}>
                  <CodeSnippet type='inline'>{cluster.topology.egressIp}</CodeSnippet>
                </Layer>
              ) : (
                'Missing…'
              )}
            </DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>First observed</DefinitionTerm>
            <DefinitionDescription>{firstObserved}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Last observed</DefinitionTerm>
            <DefinitionDescription>{lastObserved}</DefinitionDescription>
          </div>
          <div className='flex flex-col gap-1'>
            <DefinitionTerm>Created</DefinitionTerm>
            <DefinitionDescription>{created}</DefinitionDescription>
          </div>
        </DefinitionList>
      </div>
    </Tile>
  )
}
