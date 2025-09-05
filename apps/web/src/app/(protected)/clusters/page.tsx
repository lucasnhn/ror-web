// import { authGuard } from '@/features/auth/utils/auth-guard'
// import { getRorApi } from '@/services/ror-api'
// import type { Metadata } from 'next'
// import { Header } from '@/components/layout/app-shell/header'
// import { PageView } from './page-view'
// import type { KubernetesCluster } from '@ror/js-api-client'

// export const metadata: Metadata = {
//   title: 'ROR - Clusters',
//   description: 'View clusters',
// }

// export const dynamic = 'force-dynamic'

// type Search = {
//   view?: 'grid' | 'list'
//   page?: string
//   limit?: string
//   sort?: string
//   order?: 'asc' | 'desc'
//   filters?: string
//   offset?: string
// }

// export default async function ClustersPage({ searchParams }: { searchParams: Search }) {
//   const session = await authGuard()
//   const user = session.user
//   const api = await getRorApi()

//   // Coerce URL params (Next gives strings)
//   const limit = Number(searchParams.limit ?? '10') || 10
//   const page = Number(searchParams.page ?? '1') || 1
//   const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined
//   const order: 'asc' | 'desc' = searchParams.order === 'desc' ? 'desc' : 'asc'
//   const view: 'grid' | 'list' = searchParams.view === 'list' ? 'list' : 'grid'
//   const filters = searchParams.filters === 'open' ? 'open' : undefined

//   // Build list params for API
//   const listParams = new URLSearchParams()
//   listParams.set('limit', String(limit))
//   listParams.set('offset', String((page - 1) * limit))
//   if (sort) {
//     listParams.set('sort', sort)
//   }

//   const response = await api.kubernetesClusters.list(listParams)
//   const clusters: KubernetesCluster[] = response?.resources ?? []

//   // Build the object PageView expects
//   const params = {
//     view,
//     page,
//     limit,
//     sort,
//     order,
//     filters,
//   } as const

//   return (
//     <div className='w-full flex flex-col'>
//       <Header title='Clusters' />
//       <PageView user={user} clusters={clusters} params={params} />
//     </div>
//   )
// }

import { authGuard } from '@/features/auth/utils/auth-guard'
import { getRorApi } from '@/services/ror-api'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'
import type { KubernetesCluster } from '@ror/js-api-client'

export const metadata: Metadata = {
  title: 'ROR - Clusters',
  description: 'View clusters',
}

export const dynamic = 'force-dynamic'

// NOTE: Next (in dynamic routes) provides searchParams as a Promise.
// Await it ONCE, then use the plain object everywhere.
export default async function ClustersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await authGuard()
  const user = session.user
  const api = await getRorApi()

  const sp = await searchParams // <-- await exactly once

  // Coerce URL params
  const limit = Number(sp.limit ?? '10') || 10
  const page = Number(sp.page ?? '1') || 1
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined
  const order: 'asc' | 'desc' = sp.order === 'desc' ? 'desc' : 'asc'
  const view: 'grid' | 'list' = sp.view === 'list' ? 'list' : 'grid'
  const filters = sp.filters === 'open' ? 'open' : undefined

  // Build list params for API
  const listParams = new URLSearchParams()
  listParams.set('limit', String(limit))
  listParams.set('offset', String((page - 1) * limit))
  if (sort) listParams.set('sort', sort)

  const response = await api.kubernetesClusters.list(listParams)
  const clusters: KubernetesCluster[] = response?.resources ?? []

  // Object PageView expects
  const params = { view, page, limit, sort, order, filters } as const

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />
      <PageView user={user} clusters={clusters} params={params} />
    </div>
  )
}
