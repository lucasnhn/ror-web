import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ROR - Nodes',
  description: 'Nodes in a node pool',
}

interface NodesPageProps {
  params: Promise<{
    id: string
    poolId: string
  }>
}

export default async function NodesPage({ params }: NodesPageProps) {
  const { id, poolId } = await params

  return (
    <div className=''>
      <h1>
        Nodes in node pool {poolId} in cluster {id}
      </h1>
    </div>
  )
}
