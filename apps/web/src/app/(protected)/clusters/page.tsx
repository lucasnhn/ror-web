import { authGuard } from '@/features/auth/utils/auth-guard'
import { getRorApi } from '@/services/ror-api'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'
import { normalizeParams } from '@/features/cluster/utils/normalize-params'
import { fetchClusters } from '@/features/cluster/services/fetch-clusters'
import { mergeClustersByName } from '@/features/cluster/utils/merge-clusters'

export const metadata: Metadata = {
  title: 'ROR - Clusters',
  description: 'View clusters',
}

export const dynamic = 'force-dynamic'

/**
 * Renders the Clusters page for authenticated users.
 *
 * @param searchParams - A promise resolving to the search parameters from the URL.
 * @returns The rendered Clusters page as a React element.
 */
export default async function ClustersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await authGuard()
  const user = session.user
  const api = await getRorApi()

  const sp = await searchParams
  const params = normalizeParams(sp)

  const { v2Clusters, v1Clusters } = await fetchClusters(api, params)
  const mergedClusters = mergeClustersByName(v2Clusters, v1Clusters)

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />
      <PageView user={user} clusters={mergedClusters} params={params} />
    </div>
  )
}
