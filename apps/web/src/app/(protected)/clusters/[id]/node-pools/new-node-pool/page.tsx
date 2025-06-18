import type { Metadata } from 'next'
import { CreateEditView } from '../create-edit-view'

export const metadata: Metadata = {
  title: 'ROR - Create node pool',
  description: 'Create new node pool',
}

interface NewNodePoolProps {
  params: Promise<{
    id: string
  }>
}

export default async function NewNodePoolPage({ params }: NewNodePoolProps) {
  const { id } = await params

  return (
    <div className=''>
      <CreateEditView id={id} title='New node pool' buttonText='Create node pool' />
    </div>
  )
}
