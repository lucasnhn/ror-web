'use client'

import * as React from 'react'

import { Pill } from '@/components/shadcn/pill'
import { cn } from '@/utils/clsxm'
import type { KubernetesCluster } from '@ror/js-api-client'
import { Layer } from '@ror/react'
import { ExternalLink } from 'lucide-react'
import { User } from 'next-auth'
import { CodeSnippet } from '../code-snippet'
import { envBgColors } from './cluster-header'
import { HealthCircle } from './health-circle'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn('bg-[var(--r-layer)] text-card-foreground flex flex-col rounded-xl py-6 shadow-sm', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-header' className={cn('@container/card-header h-10', className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-title' className={cn('leading-none font-semibold', className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-content' className={cn('px-6', className)} {...props} />
}

export type ClusterCardDisplayData =
  | 'argocd'
  | 'grafana'
  | 'rorcli'
  | 'kubectl'
  | 'cpu'
  | 'memory'
  | 'gpu'
  | 'disk'
  | 'nodes'
  | 'monthlyPrice'
  | 'yearlyPrice'
  | 'agentVersion'
  | 'kubernetesVersion'
  | 'toolingVersion'
  | 'datacenterName'
  | 'datacenterProvider'
  | 'environment'
  | 'serviceTags'

interface ClusterCardProps {
  className?: string
  user?: User
  cluster: KubernetesCluster
  displayData?: ClusterCardDisplayData[]
}

export const envColors: Record<string, 'red' | 'yellow' | 'blue' | 'emerald' | 'gray'> = {
  prod: 'red',
  qa: 'yellow',
  dev: 'blue',
  test: 'emerald',
  undefined: 'gray',
}

const ClusterCard = ({ className, user, cluster, displayData }: ClusterCardProps) => {
  const clusterSpec = cluster.kubernetescluster?.spec
  const clusterStatus = cluster.kubernetescluster?.status
  const clusterId = clusterSpec?.data?.clusterId
  const clusterName = cluster.metadata?.name || clusterId

  const env = clusterSpec?.data?.environment
  const tools = {
    argo: clusterStatus?.state?.endpoints?.find((endpoint) => endpoint.name === 'argocd')?.address,
    grafana: clusterStatus?.state?.endpoints?.find((endpoint) => endpoint.name === 'grafana')?.address,
  }
  const cpuData = clusterStatus?.state?.cluster?.resources?.cpu
  const cpu = { capacity: cpuData?.capacity, used: cpuData?.used, percentage: cpuData?.percentage }
  const memoryData = clusterStatus?.state?.cluster?.resources?.memory
  const memory = { capacity: memoryData?.capacity, used: memoryData?.used, percentage: memoryData?.percentage }
  const gpuData = clusterStatus?.state?.cluster?.resources?.gpu
  const gpu = { capacity: gpuData?.capacity, used: gpuData?.used, percentage: gpuData?.percentage }
  const diskData = clusterStatus?.state?.cluster?.resources?.disk
  const disk = { capacity: diskData?.capacity, used: diskData?.used, percentage: diskData?.percentage }
  const nodePools = clusterSpec?.topology?.workers?.nodePools
  const nodePoolsAmount = nodePools?.length || 0
  const nodesAmount = nodePools?.reduce((total, nodePool) => total + (nodePool.replicas || 0), 0) || 0
  const prices = {
    monthly: clusterStatus?.state?.cluster?.price?.monthly || 0,
    yearly: clusterStatus?.state?.cluster?.price?.yearly || 0,
  }
  const healthCondition = clusterStatus?.conditions?.find((condition) => condition.type === 'ready')
  const versions = {
    // TODO: Make sure these are correct names
    agent: clusterStatus?.state?.versions?.find((version) => version.name === 'agent')?.version || 'Version missing',
    kubernetes:
      clusterStatus?.state?.versions?.find((version) => version.name === 'kubernetes')?.version || 'Version missing',
    nhnTooling:
      clusterStatus?.state?.versions?.find((version) => version.name === 'nhnTooling')?.version || 'Version missing',
  }
  const datacenter = { name: clusterSpec?.data?.datacenter, provider: clusterSpec?.data?.provider }
  const serverUrl =
    clusterStatus?.state?.endpoints?.find((endpoint) => endpoint.name === 'datacenter')?.address || '<missing>'
  const rorLogin = `ror login ${clusterId}`
  const kubectlLogin = `kubectl vsphere login --server=${serverUrl} -u ${user?.email} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${clusterSpec?.data?.workspace} --tanzu-kubernetes-cluster-name ${clusterName}`
  const serviceTags = cluster.rormeta.tags || []

  const handleCardClick = () => {
    window.open(`/clusters/${clusterId}`, '_blank')
  }

  const envColor = envBgColors[env ?? 'undefined'] ?? ['bg-gray-100', 'text-gray-900']

  return (
    <Card
      className={cn(
        'w-sm min-w-64 pt-0 hover:bg-[#ededed] dark:hover:bg-neutral-800 hover:cursor-pointer @container container',
        className
      )}
      onClick={handleCardClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <CardHeader className='m-0 mb-7 p-0 w-full'>
        <CardTitle className={cn('text-2xl rounded-t-xl px-6 py-2 flex', envColor[0], envColor[1])}>
          {(clusterName || 'Unnamed Cluster') as string}
        </CardTitle>
        <HealthCircle className='ml-auto mr-4 mt-[-24px] w-[52px] h-[52px] ' healthCondition={healthCondition} />
      </CardHeader>

      <CardContent className='text-sm flex flex-col gap-3'>
        <section className='grid grid-cols-2'>
          {displayData?.includes('argocd') &&
            (tools.argo ? (
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
              <p className='flex [@container(max-width:360px)]:flex-col'>
                <span className='font-bold'>ArgoCD &nbsp;</span>
                <span>missing ...</span>
              </p>
            ))}
          {displayData?.includes('grafana') &&
            (tools.grafana ? (
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
              <p className='flex [@container(max-width:360px)]:flex-col '>
                <span className='font-bold'>Grafana &nbsp;</span>
                <span>missing ...</span>
              </p>
            ))}
        </section>

        <section className='flex flex-col gap-1.5 [&>div]:gap-0.5'>
          {displayData?.includes('rorcli') && (
            <div>
              <p className='font-bold'>ROR CLI</p>
              <Layer level={2}>
                <CodeSnippet type='single'>{rorLogin}</CodeSnippet>
              </Layer>
            </div>
          )}

          {displayData?.includes('kubectl') && (
            <div>
              <p className='font-bold'>Kubectl</p>
              <Layer level={2}>
                <CodeSnippet type='single'>{kubectlLogin}</CodeSnippet>
              </Layer>
            </div>
          )}
        </section>

        <section className='flex flex-col gap-1.5 [&>div]:grid [&>div]:grid-cols-2 [@container(max-width:360px)]:[&>div]:grid-cols-1'>
          {displayData?.includes('cpu') && (
            <div>
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
          )}

          {displayData?.includes('memory') && (
            <div>
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
          )}

          {displayData?.includes('gpu') && (
            <div>
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
          )}

          {displayData?.includes('disk') && (
            <div>
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
          )}

          {displayData?.includes('nodes') && (
            <div>
              <p className='font-bold'>Nodes</p>
              <p>
                {nodesAmount} ({nodePoolsAmount} node pool{nodePoolsAmount > 1 ? 's' : ''})
              </p>
            </div>
          )}

          {displayData?.includes('monthlyPrice') && (
            <div>
              <p className='font-bold'>Monthly price</p>
              <p>{prices.monthly} kr</p>
            </div>
          )}

          {displayData?.includes('yearlyPrice') && (
            <div>
              <p className='font-bold'>Yearly price</p>
              <p>{prices.yearly} kr</p>
            </div>
          )}

          {displayData?.includes('agentVersion') && (
            <div>
              <p className='font-bold'>ROR agent version</p>
              <p>{versions.agent}</p>
            </div>
          )}

          {displayData?.includes('kubernetesVersion') && (
            <div>
              <p className='font-bold'>Kubernetes version</p>
              <p>{versions.kubernetes}</p>
            </div>
          )}

          {displayData?.includes('toolingVersion') && (
            <div>
              <p className='font-bold'>NHN tooling version</p>
              <p>{versions.nhnTooling}</p>
            </div>
          )}

          {displayData?.includes('datacenterName') && (
            <div>
              <p className='font-bold'>Datacenter</p>
              <p>{datacenter.name}</p>
            </div>
          )}

          {displayData?.includes('datacenterProvider') && (
            <div>
              <p className='font-bold'>Datacenter provider</p>
              <p>{datacenter.provider}</p>
            </div>
          )}

          {displayData?.includes('environment') && (
            <div>
              <p className='font-bold'>Environment</p>
              <p>
                <Pill variant={envColors[env ?? 'undefined']} className='px-3'>
                  {(env ?? 'Undefined').charAt(0).toUpperCase() + (env ?? 'Undefined').slice(1)}
                </Pill>
              </p>
            </div>
          )}
          {displayData?.includes('serviceTags') && (
            <div>
              <p className='font-bold'>Service tags</p>
              <p className='flex flex-wrap gap-1'>
                {serviceTags.map((tag: { key: string; value: string; properties: { color: string } }) => (
                  <Pill key={tag.key} style={{ backgroundColor: tag.properties.color }}>
                    {tag.value}
                  </Pill>
                ))}
              </p>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

export { ClusterCard }
