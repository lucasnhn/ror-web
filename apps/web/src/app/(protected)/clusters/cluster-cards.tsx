import { DefinitionDescription, DefinitionList, DefinitionTerm, Stack, Tile } from '@ror/react'
import type { Cluster } from '@ror/js-api-client'
import Link from 'next/link'
import clsxm from '@/utils/clsxm'
import { HealthStatus } from '@/components/ui/health-status'
import { convertBytes } from '@/utils/bytes'
import { EnvironmentTag } from '@/components/ui/environment-tag'
import { getCommonClusterTools } from '@/features/clusters/utils/tools'
import { ExternalLink } from 'lucide-react'

interface ClusterCardProps {
  cluster: Cluster
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

  const tools = getCommonClusterTools(cluster)

  return (
    <Tile className={classes}>
      <div className='flex items-center gap-5 mb-7'>
        <Link href={`/clusters/${clusterId}`} title={clusterName} className='text-link'>
          <h2 className='heading-04'>{clusterName}</h2>
        </Link>
        <EnvironmentTag environment={cluster.environment} size='md' />
      </div>

      <div className='grid grid-cols-[max-content_1fr] gap-x-8'>
        <div className='grid grid-cols-subgrid col-span-2 gap-y-4 mb-7'>
          <Stack gap={2}>
            <span className='label-01 text-secondary'>CPU</span>
            <div className='flex gap-2 items-baseline'>
              <span className='heading-03'>{cpuPercentage}%</span>
              <span className='label-02'>({cpuCount} cores)</span>
            </div>
          </Stack>
          <Stack gap={2}>
            <span className='label-01 text-secondary'>Memory</span>
            <div className='flex gap-2 items-baseline'>
              <span className='heading-03'>{bytesPercentage}%</span>
              <span className='label-02'>({formattedBytes})</span>
            </div>
          </Stack>
          <Stack gap={2}>
            <span className='label-01 text-secondary'>Status</span>
            <HealthStatus status={cluster.healthStatus.health} size='md' />
          </Stack>
        </div>

        <DefinitionList className='grid grid-cols-subgrid col-span-2 gap-x-0 gap-y-2'>
          <DefinitionTerm>Tooling</DefinitionTerm>
          <DefinitionDescription className='truncate' title={cluster.versions?.nhnTooling.version}>
            {cluster.versions?.nhnTooling.version}
          </DefinitionDescription>
          <DefinitionTerm>Project</DefinitionTerm>
          <DefinitionDescription className='truncate' title={cluster.metadata?.project?.name ?? ''}>
            {cluster.metadata?.project?.name ?? ''}
          </DefinitionDescription>

          <DefinitionTerm>Argo</DefinitionTerm>
          <DefinitionDescription>
            {tools.argo ? (
              <a
                href={`https://${tools.argo}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-link'
              >
                <span>Open ArgoCD</span>
                <ExternalLink className='w-5 h-5 text-current' />
              </a>
            ) : (
              'Missing…'
            )}
          </DefinitionDescription>

          <DefinitionTerm>Grafana</DefinitionTerm>
          <DefinitionDescription>
            {tools.grafana ? (
              <a
                href={`https://${tools.grafana}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-link'
              >
                <span>Open Grafana</span>
                <ExternalLink className='w-5 h-5 text-current' />
              </a>
            ) : (
              'Missing…'
            )}
          </DefinitionDescription>
        </DefinitionList>
      </div>
    </Tile>
  )
}

interface ClusterTableProps<T> {
  data: T[]
}

export function ClusterCards<T extends Cluster>({ data }: ClusterTableProps<T>) {
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
