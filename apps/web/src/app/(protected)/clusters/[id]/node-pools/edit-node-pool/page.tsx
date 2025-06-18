import type { Metadata } from 'next'
import { CreateEditView } from '../create-edit-view'

export const metadata: Metadata = {
  title: 'ROR - Edit node pool',
  description: 'Edit node pool',
}

interface EditNodePoolProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditNodePoolPage({ params }: EditNodePoolProps) {
  const { id } = await params

  return (
    <div className=''>
      <CreateEditView id={id} title='Edit node pool' buttonText='Save changes' />
    </div>
  )
}
