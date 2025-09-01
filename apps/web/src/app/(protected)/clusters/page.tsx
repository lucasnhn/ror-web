import { authGuard } from '@/features/auth/utils/auth-guard'
import { getRorApi } from '@/services/ror-api'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'
import type { Cluster, KubernetesCluster } from '@ror/js-api-client'

export const metadata: Metadata = {
  title: 'ROR - Clusters',
  description: 'View clusters',
}

interface ClusterPageProps {
  searchParams: Promise<{
    view?: 'grid' | 'list'
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
    filters?: string
  }>
}

interface Pair {
  v2: KubernetesCluster
  v1?: Cluster
}

export const dynamic = 'force-dynamic'

export default async function ClustersPage({ searchParams }: ClusterPageProps) {
  const session = await authGuard()
  const user = session.user
  const api = await getRorApi()

  // Build URL parameters for the list method
  const params = await searchParams
  const listParams = new URLSearchParams()

  const DEFAULT_LIMIT = 10
  const DEFAULT_PAGE = 1

  // Parse pagination parameters from URL
  const limit = Number(params.limit) || DEFAULT_LIMIT
  const page = Number(params.page) || DEFAULT_PAGE // URL shows 1-based indexing
  const skip = (page - 1) * limit

  // Parse sorting parameters from URL
  const sort = params.sort ? params.sort : 'clusterName'
  const order = params.order === 'asc' ? 1 : -1

  const sortOptions = {
    sortField: sort,
    sortOrder: order,
  }

  const requestOptions = {
    limit,
    skip,
    sort: params.sort ? [sortOptions] : [],
  }

  function isEmptyValue(value: string | number | boolean | null | undefined): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      value === 0 ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
    )
  }

  // If needed, add pagination and sorting params to the list request
  if (params.limit) listParams.set('limit', params.limit.toString())
  if (params.page) listParams.set('page', params.page.toString())
  if (params.sort) listParams.set('sort', params.sort)
  if (params.order) listParams.set('order', params.order)
  const response = await api.kubernetesClusters.list(listParams)
  const v1response = await api.kubernetesClusters.filter(requestOptions)

  const clusters: KubernetesCluster[] = response?.resources ?? []
  const v1clusters: Cluster[] = v1response?.data ?? []

  const v2Name = (c: KubernetesCluster) => c?.metadata?.name?.toLowerCase().trim() ?? ''
  const v1Name = (c: Cluster) => c?.clusterName?.toLowerCase().trim() ?? ''

  function pairClustersByName(v2: KubernetesCluster[], v1: Cluster[]): Pair[] {
    const matchedClusters: Pair[] = []
    for (const c2 of v2) {
      const c1 = v1.find((c) => v1Name(c) === v2Name(c2))
      matchedClusters.push({ v2: c2, v1: c1 })
    }
    return matchedClusters
  }

  function mergeClusterData(primary: KubernetesCluster, secondary?: Cluster): KubernetesCluster {
    if (!secondary) return primary

    const mergedCluster: KubernetesCluster = {
      kind: primary.kind,
      apiVersion: primary.apiVersion,
      metadata: {
        name: isEmptyValue(primary.metadata.name) ? secondary.clusterName : primary.metadata.name,
        namespace: isEmptyValue(primary.metadata.namespace) ? secondary.workspace.name : primary.metadata.namespace,
        uid: primary.metadata.uid,
        creationTimestamp: isEmptyValue(primary.metadata.creationTimestamp)
          ? secondary.created
          : primary.metadata.creationTimestamp,
      },
      rormeta: {
        version: primary.rormeta.version,
        hash: primary.rormeta.hash,
        ownerref: {
          scope: primary.rormeta.ownerref?.scope || 'empty',
          subject: primary.rormeta.ownerref?.subject || 'empty',
        },
        action: primary.rormeta.action,
      },
      kubernetescluster: {
        spec: {
          data: {
            clusterId: isEmptyValue(primary.kubernetescluster?.spec?.data?.clusterId)
              ? secondary.clusterId
              : primary.kubernetescluster?.spec?.data?.clusterId,
            provider: isEmptyValue(primary.kubernetescluster?.spec?.data?.provider)
              ? secondary.workspace.datacenter.provider
              : primary.kubernetescluster?.spec?.data?.provider,
            datacenter: isEmptyValue(primary.kubernetescluster?.spec?.data?.datacenter)
              ? secondary.workspace.datacenter.name
              : primary.kubernetescluster?.spec?.data?.datacenter,
            region: primary.kubernetescluster?.spec?.data?.region,
            zone: primary.kubernetescluster?.spec?.data?.zone,
            project: primary.kubernetescluster?.spec?.data?.project,
            workspace: isEmptyValue(primary.kubernetescluster?.spec?.data?.workspace)
              ? secondary.workspace.name
              : primary.kubernetescluster?.spec?.data?.workspace,
            workorder: primary.kubernetescluster?.spec?.data?.workorder,
            environment: isEmptyValue(primary.kubernetescluster?.spec?.data?.environment)
              ? secondary.environment
              : primary.kubernetescluster?.spec?.data?.environment,
          },
          topology: {
            version: primary.kubernetescluster?.spec?.topology?.version,
            controlplane: {
              replicas: primary.kubernetescluster?.spec?.topology?.controlplane?.replicas,
              version: primary.kubernetescluster?.spec?.topology?.controlplane?.version,
              provider: primary.kubernetescluster?.spec?.topology?.controlplane?.provider,
              machineClass: primary.kubernetescluster?.spec?.topology?.controlplane?.machineClass,
              metadata: {
                labels: primary.kubernetescluster?.spec?.topology?.controlplane?.metadata?.labels,
                annotations: primary.kubernetescluster?.spec?.topology?.controlplane?.metadata?.annotations,
              },
              storage: primary.kubernetescluster?.spec?.topology?.controlplane?.storage,
            },
            workers: {
              nodePools: (primary.kubernetescluster?.spec?.topology?.workers?.nodePools ?? []).map((np) => ({
                machineClass: np?.machineClass ?? undefined,
                provider: np?.provider ?? undefined,
                version: np?.version ?? undefined,
                name: np?.name ?? undefined,
                replicas: np?.replicas ?? undefined,
                autoscaling: np?.autoscaling
                  ? {
                      enabled: np.autoscaling?.enabled ?? undefined,
                      minReplicas: np.autoscaling?.minReplicas ?? undefined,
                      maxReplicas: np.autoscaling?.maxReplicas ?? undefined,
                      scalingRules: np.autoscaling?.scalingRules ?? undefined,
                    }
                  : undefined,
                metadata: np?.metadata
                  ? {
                      labels: np.metadata?.labels ?? undefined,
                      annotations: np.metadata?.annotations ?? undefined,
                    }
                  : undefined,
              })),
            },
          },
        },
        status: {
          state: {
            cluster: {
              externalId: primary.kubernetescluster?.status?.state?.cluster?.externalId,
              resources: primary.kubernetescluster?.status?.state?.cluster?.resources,
              price: {
                monthly: isEmptyValue(primary.kubernetescluster?.status?.state?.cluster?.price?.monthly)
                  ? secondary.metrics.priceMonth
                  : primary.kubernetescluster?.status?.state?.cluster?.price?.monthly,
                yearly: isEmptyValue(primary.kubernetescluster?.status?.state?.cluster?.price?.yearly)
                  ? secondary.metrics.priceYear
                  : primary.kubernetescluster?.status?.state?.cluster?.price?.yearly,
              },
              controlplane: {
                status: primary.kubernetescluster?.status?.state?.cluster?.controlplane?.status,
                message: primary.kubernetescluster?.status?.state?.cluster?.controlplane?.message,
                scale: primary.kubernetescluster?.status?.state?.cluster?.controlplane?.scale,
                machineClass: primary.kubernetescluster?.status?.state?.cluster?.controlplane?.machineClass,
                resources: primary.kubernetescluster?.status?.state?.cluster?.controlplane?.resources,
                nodes: primary.kubernetescluster?.status?.state?.cluster?.controlplane?.nodes,
              },
              nodepools: primary.kubernetescluster?.status?.state?.cluster?.nodepools,
            },
            versions: primary.kubernetescluster?.status?.state?.versions,
            endpoints: primary.kubernetescluster?.status?.state?.endpoints,
            egressIP: primary.kubernetescluster?.status?.state?.egressIP,
            lastUpdated: primary.kubernetescluster?.status?.state?.lastUpdated,
            lastUpdatedBy: primary.kubernetescluster?.status?.state?.lastUpdatedBy,
            created: primary.kubernetescluster?.status?.state?.created,
          },
          phase: primary.kubernetescluster?.status?.phase,
          conditions: primary.kubernetescluster?.status?.conditions,
        },
      },
    }

    return mergedCluster
  }

  function mergeClusters(pairs: Pair[]) {
    const merged = []
    for (const { v1, v2 } of pairs) {
      merged.push(mergeClusterData(v2, v1))
    }
    return merged
  }

  const pairs: Pair[] = pairClustersByName(clusters, v1clusters)
  const mergedClusters = mergeClusters(pairs)

  return (
    <div className='w-full flex flex-col'>
      <Header title='Clusters' />
      <PageView user={user} clusters={mergedClusters} params={params} />
    </div>
  )
}
