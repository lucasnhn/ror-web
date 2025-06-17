'use client'

import { useClusterContext } from '@/context/cluster-context'
import { CodeSnippet } from '@ror/react/components/code-snippet'

interface ClusterPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClusterRawDataPage({ params }: ClusterPageProps) {
  const { cluster } = useClusterContext()

  return (
    <div className=''>
      <h3>KubernetesCluster</h3>
      <CodeSnippet type='multi' style={{ '--code-snippet-multi-max-height': '40rem' }}>
        {JSON.stringify(cluster, null, 4)}
      </CodeSnippet>
    </div>
  )
}
