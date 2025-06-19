import type { Metadata } from 'next'
import { ClusterDetails } from '@/components/ui/cluster/cluster-details'

export const metadata: Metadata = {
  title: 'ROR - Cluster',
  description: 'View and manage cluster details',
}

export default async function ClusterPage() {
  return (
    <div className='@container'>
      <ClusterDetails />
    </div>
  )
}
