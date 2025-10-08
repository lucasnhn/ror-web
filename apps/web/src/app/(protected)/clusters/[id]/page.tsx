/*
 * FILE OVERVIEW:
 *
 * Server component that fetches and displays details for a specific Kubernetes cluster
 * identified by its ID from the URL. Renders the ClusterDetails component.
 */

import type { Metadata } from 'next'
import { ClusterDetails } from '@/features/cluster/components/cluster-details'

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
