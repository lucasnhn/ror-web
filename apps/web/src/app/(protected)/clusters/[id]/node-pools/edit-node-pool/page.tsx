import type { Metadata } from 'next'
import { CreateEditView } from '../create-edit-view'

export const metadata: Metadata = {
  title: 'ROR - Edit node pool',
  description: 'Edit node pool',
}

interface EditNodePoolProps {
  params: {
    id: string
  }
}

export default function EditNodePoolPage({ params }: EditNodePoolProps) {
  const { id } = params

  return (
    <div className=''>
      <CreateEditView id={id} title='Edit node pool' buttonText='Save changes' />
    </div>
  )
}
