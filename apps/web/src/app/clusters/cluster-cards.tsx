import { DefinitionDescription, DefinitionList, DefinitionTerm, Tile } from '@ror/react'
import type { ClusterListItem } from '@ror/js-api-client'
import Link from 'next/link'
import clsxm from '@/utils/clsxm'
import { HealthStatus } from '@/components/ui/health-status'
import { convertBytes } from '@/utils/bytes'
import { localizeDate } from '@/utils/time-and-date'

interface ClusterCardProps {
  cluster: ClusterListItem
  className?: string
}

function ClusterCard({ cluster, className }: ClusterCardProps) {
  const { clusterId, clusterName, metrics } = cluster

  const classes = clsxm('px-5 pt-4 pb-6', className)

  const cpuPercentage = metrics.cpuPercentage
  const cpuCount = metrics.cpu

  const bytesPercentage = metrics.memoryPercentage
  const bytes = metrics.memory
  const formattedBytes = convertBytes(bytes, { useBinaryUnits: true })

  return (
    <Tile className={classes} asChild kind='clickable'>
      <Link href={`/clusters/${clusterId}`} title={clusterName}>
        <div className='flex justify-between items-center mb-7'>
          <h2 className='heading-03'>{clusterName}</h2>
          <HealthStatus status={cluster.healthStatus.health} size='lg' />
        </div>
        <div className='grid grid-cols-[max-content_1fr] gap-x-8'>
          <div className='grid grid-cols-subgrid col-span-2 mb-7'>
            <div>
              <span className='label-01 text-secondary'>CPU</span>
              <div className='flex gap-2 items-baseline'>
                <span className='heading-03'>{cpuPercentage}%</span>
                <span className='label-02'>({cpuCount} cores)</span>
              </div>
            </div>
            <div>
              <span className='label-01 text-secondary'>Memory</span>
              <div className='flex gap-2 items-baseline'>
                <span className='heading-03'>{bytesPercentage}%</span>
                <span className='label-02'>({formattedBytes})</span>
              </div>
            </div>
          </div>

          <DefinitionList className='grid grid-cols-subgrid col-span-2 gap-x-0 gap-y-2'>
            <DefinitionTerm>Last heartbeat</DefinitionTerm>
            <DefinitionDescription className='truncate' title={localizeDate(cluster.lastObserved)}>
              {localizeDate(cluster.lastObserved)}
            </DefinitionDescription>
            <DefinitionTerm>Created at</DefinitionTerm>
            <DefinitionDescription className='truncate' title={localizeDate(cluster.created)}>
              {localizeDate(cluster.created)}
            </DefinitionDescription>
            <DefinitionTerm>Tooling</DefinitionTerm>
            <DefinitionDescription className='truncate' title={cluster.versions?.nhnTooling.version}>
              {cluster.versions?.nhnTooling.version}
            </DefinitionDescription>
            <DefinitionTerm>Project</DefinitionTerm>
            <DefinitionDescription className='truncate' title={cluster.metadata?.project?.name ?? ''}>
              {cluster.metadata?.project?.name ?? ''}
            </DefinitionDescription>
          </DefinitionList>
        </div>
      </Link>
    </Tile>
  )
}

interface ClusterTableProps<T> {
  data: T[]
}

export function ClusterCards<T extends ClusterListItem>({ data }: ClusterTableProps<T>) {
  return (
    <div className='grid grid-cols-12 gap-6 @container'>
      {data.map((c) => (
        <ClusterCard
          key={c.clusterId}
          cluster={c}
          className='col-span-12 @lg:col-span-6 @4xl:col-span-4 @6xl:col-span-3'
        />
      ))}
    </div>
  )
}
