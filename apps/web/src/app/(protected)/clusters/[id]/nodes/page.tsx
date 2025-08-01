import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ROR - Nodes',
  description: 'View nodes',
}

interface NodesProps {
  className?: string
}

export const Nodes = ({ className }: NodesProps) => {
  return (
    <div className={className}>
      <h1 className='text-2xl font-bold mb-4'>Nodes</h1>
      <p className='text-gray-600'>This is the nodes page.</p>
      {/* <PageView data= */}
    </div>
  )
}

export default Nodes
