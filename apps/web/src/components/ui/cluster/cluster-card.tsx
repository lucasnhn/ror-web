'use client'

import * as React from 'react'

import { Pill } from '@/components/shadcn/pill'
import { getCommonClusterTools } from '@/features/clusters/utils/tools'
import { convertBytes } from '@/utils/bytes'
import { cn } from '@/utils/clsxm'
import type { Cluster } from '@ror/js-api-client'
import { CodeSnippet, Layer } from '@ror/react'
import { ExternalLink } from 'lucide-react'
import { User } from 'next-auth'
import { useRouter } from 'next/navigation'
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
  | 'accessGroups'
  | 'cpu'
  | 'memory'
  | 'nodes'
  | 'monthlyPrice'
  | 'yearlyPrice'
  | 'agentVersion'
  | 'kubernetesVersion'
  | 'toolingVersion'
  | 'datacenterName'
  | 'datacenterProvider'
  | 'environment'

interface ClusterCardProps {
  className?: string
  user?: User
  cluster: Cluster
  displayData?: ClusterCardDisplayData[]
}

export const envColors: Record<string, 'red' | 'yellow' | 'blue' | 'emerald'> = {
  prod: 'red',
  qa: 'yellow',
  dev: 'blue',
  test: 'emerald',
}

const ClusterCard = ({ className, user, cluster, displayData }: ClusterCardProps) => {
  const env = cluster.environment
  const accessGroups = cluster.acl.accessGroups
  const health = cluster.healthStatus.health
  const tools = getCommonClusterTools(cluster)
  const metrics = cluster.metrics
  const versions = cluster.versions
  const datacenter = cluster.workspace.datacenter
  const serverUrl = datacenter.apiEndpoint || '<missing>'
  const rorLogin = `ror login ${cluster.clusterId}`
  const kubectlLogin = `kubectl vsphere login --server=${serverUrl} -u ${user?.email} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${cluster?.workspace?.name} --tanzu-kubernetes-cluster-name ${cluster?.clusterName}`

  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/clusters/${cluster.clusterId}`)
  }

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
        <CardTitle className={cn('text-2xl rounded-t-xl px-6 py-2 flex', envBgColors[env!][0], envBgColors[env!][1])}>
          {cluster.clusterName}
        </CardTitle>
        <HealthCircle className='ml-auto mr-4 top-[-24px] w-[52px] h-[52px] ' health={health} />
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
          {displayData?.includes('accessGroups') && (
            <div>
              <p className='font-bold'>Access groups</p>
              <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                {accessGroups.length ? (
                  accessGroups.map((group, index) => (
                    <p key={index} title={group}>
                      {group}
                    </p>
                  ))
                ) : (
                  <p>No access groups</p>
                )}
              </div>
            </div>
          )}

          {displayData?.includes('cpu') && (
            <div>
              <p className='font-bold'>CPU</p>
              <p>
                {metrics.cpuPercentage}% ({metrics.cpuConsumed}m of {metrics.cpu} cores)
              </p>
            </div>
          )}

          {displayData?.includes('memory') && (
            <div>
              <p className='font-bold'>Memory</p>
              <p>
                {metrics.memoryPercentage}% (
                {convertBytes(metrics.memoryConsumed, { useBinaryUnits: true, includeUnit: false })} of&nbsp;
                {convertBytes(metrics.memory, { useBinaryUnits: true })})
              </p>
            </div>
          )}

          {displayData?.includes('nodes') && (
            <div>
              <p className='font-bold'>Nodes</p>
              <p>
                {metrics.nodeCount} ({metrics.nodePoolCount} node pool{metrics.nodePoolCount > 1 ? 's' : ''})
              </p>
            </div>
          )}

          {displayData?.includes('monthlyPrice') && (
            <div>
              <p className='font-bold'>Monthly price</p>
              <p>{metrics.priceMonth} kr</p>
            </div>
          )}

          {displayData?.includes('yearlyPrice') && (
            <div>
              <p className='font-bold'>Yearly price</p>
              <p>{metrics.priceYear} kr</p>
            </div>
          )}

          {displayData?.includes('agentVersion') && (
            <div>
              <p className='font-bold'>ROR agent version</p>
              <p>{versions.agent?.version}</p>
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
              <p>{versions.nhnTooling.version}</p>
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
                <Pill variant={envColors[env]} className='px-3'>
                  {env.charAt(0).toUpperCase() + env.slice(1)}
                </Pill>
              </p>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

export { ClusterCard }
