import type { Metadata } from 'next'
import { PageView } from './page-view'
import { getRorApi } from '@/services/ror-api'

interface NodePoolsPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'ROR - Node pools',
  description: 'View and manage node pools',
}

export default async function NodePoolsPage({ params }: NodePoolsPageProps) {
  const { id } = await params
  const api = await getRorApi()
  const nodes = (await api.nodes.listByCluster(id))?.resources ?? []
  return <PageView id={id} initialNodes={nodes} />
}
