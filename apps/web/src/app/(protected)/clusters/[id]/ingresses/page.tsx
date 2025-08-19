import { getRorApi } from '@/services/ror-api'
import { ClusterIngressesDataView } from './ingress-data-view'

interface ClusterIngressesPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClusterIngressesPage({ params }: ClusterIngressesPageProps) {
  const { id } = await params

  const api = await getRorApi()

  const ingressFilter = [
    {
      field: 'rormeta.ownerref.subject',
      type: 'string',
      operator: 'eq',
      value: id,
    },
  ]
  const listParams = new URLSearchParams([['filter', JSON.stringify(ingressFilter)]])
  const clusterIngresses = await api.ingresses.list(listParams)
  const ingresses = clusterIngresses?.resources ?? []

  if (!ingresses) {
    return <div>No ingresses found</div>
  }

  return <ClusterIngressesDataView ingresses={ingresses} />
}
