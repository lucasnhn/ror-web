/*
 * FILE OVERVIEW:
 *
 * Server component that prepares data and renders the CreateEditView
 * for creating a new node pool within a cluster.
 *
 * Fetches machine class pricing via ROR API and passes it as props.
 */

import type { Metadata } from 'next'
import { CreateEditView } from '@/features/cluster/components/create-edit-view'
import { getRorApi } from '@/services/ror-api'

export const metadata: Metadata = {
  title: 'ROR - Create node pool',
  description: 'Create new node pool',
}

interface NewNodePoolProps {
  params: {
    id: string
  }
}

/**
 * Renders the page for creating a new node pool within a specific cluster.
 *
 * @param params - The route parameters containing the cluster `id`.
 * @returns A React element displaying the new node pool creation view.
 */
export default async function NewNodePoolPage({ params }: NewNodePoolProps) {
  const { id } = params

  const api = await getRorApi()
  const res = await api.prices.list()

  type Price = {
    id: string
    machineClass: string
    price: number
  }

  const items: Price[] = Array.isArray(res) ? res : []
  const simplePrices = items.map(({ id, machineClass, price }) => ({
    id,
    machineClass,
    price,
  }))

  return <CreateEditView id={id} simplePrices={simplePrices} title='New node pool' buttonText='Create node pool' />
}
