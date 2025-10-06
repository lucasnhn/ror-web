/*
 * FILE OVERVIEW:
 *
 * Client component that renders the raw data view for a specific Kubernetes cluster.
 */

'use client'

import { useClusterContext } from '@/context/cluster-context'
import { CodeSnippet } from '@ror/react/components/code-snippet'

export default function ClusterRawDataPage() {
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
