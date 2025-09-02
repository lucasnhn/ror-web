import type { Metadata } from 'next'
import { CreateEditView } from '../create-edit-view'
import { getRorApi } from '@/services/ror-api'

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

  const api = await getRorApi()
  const res = await api.prices.list()

  type Price = {
    id: string
    machineClass: string
    price: number
  }

  const items: Price[] = Array.isArray(res) ? res : []
  console.log('[NODEPOOLS PAGE] Prices:', items)
  const simplePrices = items.map(({ id, machineClass, price }) => ({
    id,
    machineClass,
    price,
  }))

  return (
    <div className=''>
      <CreateEditView id={id} simplePrices={simplePrices} title='New node pool' buttonText='Create node pool' />
    </div>
  )
}
