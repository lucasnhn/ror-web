import type { Metadata } from 'next'
import { CreateEditView } from '../create-edit-view'

export const metadata: Metadata = {
  title: 'ROR - Create node pool',
  description: 'Create new node pool',
}

interface NewNodePoolProps {
  params: {
    id: string
  }
}

export default function NewNodePoolPage({ params }: NewNodePoolProps) {
  const { id } = params

  return (
    <div className=''>
      <CreateEditView id={id} title='New node pool' buttonText='Create node pool' />
    </div>
  )
}
