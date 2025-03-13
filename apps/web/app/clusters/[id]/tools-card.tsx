import clsxm from '@/utils/clsxm'
import { Cluster } from '@ror/js-api-client'
import { Stack } from '@ror/react'
import { CodeSnippet } from '@ror/react/components/code-snippet'
import { Layer } from '@ror/react/components/layer'
import { Tile } from '@ror/react/components/tile'
import { User } from 'next-auth'

interface ClusterToolsCardProps {
  cluster: Cluster
  user?: User
  className?: string
}

export function ClusterToolsCard({ cluster, user, className }: ClusterToolsCardProps) {
  const serverUrl =
    cluster.workspace.datacenter.apiEndpoint.length > 0 ? cluster.workspace.datacenter.apiEndpoint : '<missing>'

  const rorLogin = `ror login ${cluster.clusterId}`
  const kubectlLogin = `kubectl vsphere login --server=${serverUrl} -u ${user?.email} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${cluster?.workspace?.name} --tanzu-kubernetes-cluster-name ${cluster?.clusterName}`

  const classes = clsxm('p-5', className)

  return (
    <Tile className={classes}>
      <h3 className='text-base pb-3 mb-5 border-b border-b-(--r-border-subtle)'>Tools</h3>
      <Layer level={1}>
        <Stack gap={5} className='max-w-full'>
          <div>
            <h4 className='text-sm text-secondary font-medium mb-2'>ROR CLI</h4>
            <CodeSnippet type='single'>{rorLogin}</CodeSnippet>
          </div>
          <div>
            <h4 className='text-sm text-secondary font-medium mb-2'>Kubectl</h4>
            <CodeSnippet type='single'>{kubectlLogin}</CodeSnippet>
          </div>
        </Stack>
      </Layer>
    </Tile>
  )
}
