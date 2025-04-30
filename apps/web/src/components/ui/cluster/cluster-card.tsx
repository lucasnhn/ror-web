import * as React from 'react'

import { cn } from '@/utils/clsxm'
import { CircleCheck, CircleHelp, ExternalLink, Skull, TriangleAlert } from 'lucide-react'
import { Cluster } from '@ror/js-api-client'
import { getCommonClusterTools } from '@/features/clusters/utils/tools'
import { CodeSnippet, Layer } from '@ror/react'
import { User } from 'next-auth'
import { Pill } from '@/components/shadcn/pill'
import { convertBytes } from '@/utils/bytes'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn('bg-neutral-100 text-card-foreground flex flex-col rounded-xl py-6 shadow-sm', className)}
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

interface ClusterCardProps {
  className?: string
  user?: User
  cluster: Cluster
}

const envBgColors: Record<string, string> = {
  prod: 'bg-red-500',
  qa: 'bg-yellow-500',
  dev: 'bg-blue-500',
  test: 'bg-emerald-500',
}

const envColors: Record<string, string> = {
  prod: 'red',
  qa: 'yellow',
  dev: 'blue',
  test: 'emerald',
}

const healthColors = ['bg-cyan-500', 'bg-orange-500', 'bg-[#EF4444]']

// health is number from 1 to 3
const getHealthSymbol = (health: number) => {
  const icons = [CircleCheck, TriangleAlert, Skull]
  const Icon = icons[health - 1] || CircleHelp
  return <Icon className='text-neutral-100 w-8 h-8' />
}

interface HealthCircleProps {
  health: number
}

const HealthCircle = ({ health }: HealthCircleProps) => (
  <div className='bg-neutral-100 p-0.5 w-[52px] h-[52px] rounded-full relative ml-auto mr-4 top-[-24px]'>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${healthColors[health - 1]}`}>
      {getHealthSymbol(health)}
    </div>
  </div>
)

const ClusterCard = ({ className, user, cluster }: ClusterCardProps) => {
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

  return (
    <Card className={cn('w-sm pt-0', className)}>
      <CardHeader className='m-0 mb-7 p-0 w-full'>
        <CardTitle className={cn('text-2xl rounded-t-xl px-6 py-1', envBgColors[env!])}>
          {cluster.clusterName}
        </CardTitle>
        <HealthCircle health={health} />
      </CardHeader>

      <CardContent className='text-sm flex flex-col gap-3'>
        <section className='grid grid-cols-2'>
          {tools.argo ? (
            <a
              href={`https://${tools.argo}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex gap-2 font-bold text-blue-500'
            >
              <span>ArgoCD</span>
              <ExternalLink className='w-5 h-5' />
            </a>
          ) : (
            <p className='flex'>
              <span className='font-bold'>ArgoCD &nbsp;</span>missing ...
            </p>
          )}
          {tools.grafana ? (
            <a
              href={`https://${tools.grafana}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex gap-2 font-bold text-blue-500'
            >
              <span>Graphana</span>
              <ExternalLink className='w-5 h-5' />
            </a>
          ) : (
            <p className='flex'>
              <span className='font-bold'>Graphana &nbsp;</span>missing ...
            </p>
          )}
        </section>

        <section className='flex flex-col gap-1.5 [&>div]:gap-0.5'>
          <div>
            <p className='font-bold'>ROR CLI</p>
            <Layer level={2}>
              <CodeSnippet type='single'>{rorLogin}</CodeSnippet>
            </Layer>
          </div>
          <div>
            <p className='font-bold'>Kubectl</p>
            <Layer level={2}>
              <CodeSnippet type='single'>{kubectlLogin}</CodeSnippet>
            </Layer>
          </div>
        </section>

        <section className='flex flex-col gap-1.5 [&>div]:grid [&>div]:grid-cols-2'>
          <div>
            <p className='font-bold'>Access groups</p>
            <div>
              {accessGroups.length ? (
                accessGroups.map((group, index) => <p key={index}>{group}</p>)
              ) : (
                <p>No access groups</p>
              )}
            </div>
          </div>
          <div>
            <p className='font-bold'>CPU</p>
            <p>
              {metrics.cpuPercentage}% ({metrics.cpuConsumed}m of {metrics.cpu} cores)
            </p>
          </div>
          <div>
            <p className='font-bold'>Memory</p>
            <p>
              {metrics.memoryPercentage}% (
              {convertBytes(metrics.memoryConsumed, { useBinaryUnits: true, includeUnit: false })} of&nbsp;
              {convertBytes(metrics.memory, { useBinaryUnits: true })})
            </p>
          </div>
          <div>
            <p className='font-bold'>Nodes</p>
            <p>
              {metrics.nodeCount} ({metrics.nodePoolCount} node pool{metrics.nodePoolCount > 1 ? 's' : ''})
            </p>
          </div>
          <div>
            <p className='font-bold'>Monthly price</p>
            <p>{metrics.priceMonth} kr</p>
          </div>
          <div>
            <p className='font-bold'>Yearly price</p>
            <p>{metrics.priceYear} kr</p>
          </div>
          <div>
            <p className='font-bold'>ROR agent version</p>
            <p>{versions.agent?.version}</p>
          </div>
          <div>
            <p className='font-bold'>Kubernetes version</p>
            <p>{versions.kubernetes}</p>
          </div>
          <div>
            <p className='font-bold'>NHN tooling version</p>
            <p>{versions.nhnTooling.version}</p>
          </div>
          <div>
            <p className='font-bold'>Datacenter</p>
            <p>{datacenter.name}</p>
          </div>
          <div>
            <p className='font-bold'>Datacenter provider</p>
            <p>{datacenter.provider}</p>
          </div>
          <div>
            <p className='font-bold'>Environment</p>
            <p>
              <Pill variant={envColors[env]} className='px-3'>
                {env.charAt(0).toUpperCase() + env.slice(1)}
              </Pill>
            </p>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

export { ClusterCard }
