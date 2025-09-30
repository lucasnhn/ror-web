import type { Cluster, KubernetesCluster } from '@ror/js-api-client'
import {
  getClusterId,
  getClusterName,
  getClusterNamespace,
  getCreationTimestamp,
  getDatacenter,
  getEnvironment,
  getPrices,
  getProvider,
  getWorkspace,
} from './cluster'

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0
  return false
}

export function mergeClustersByName(v2: KubernetesCluster[], v1: Cluster[]): KubernetesCluster[] {
  const v2Name = (c: KubernetesCluster) => c?.metadata?.name?.toLowerCase().trim() ?? ''
  const v1Name = (c: Cluster) => c?.clusterName?.toLowerCase().trim() ?? ''

  return v2.map((c2) => {
    const c1 = v1.find((c) => v1Name(c) === v2Name(c2))
    return mergeClusterData(c2, c1)
  })
}

function mergeClusterData(primary: KubernetesCluster, secondary?: Cluster): KubernetesCluster {
  if (!secondary) return primary

  return {
    ...primary,
    metadata: {
      ...primary.metadata,
      name: isEmptyValue(getClusterName(primary)) ? secondary.clusterName : getClusterName(primary),
      namespace: isEmptyValue(getClusterNamespace(primary))
        ? typeof secondary.clusterNamespace === 'string'
          ? secondary.clusterNamespace
          : undefined
        : getClusterNamespace(primary),
      creationTimestamp: isEmptyValue(getCreationTimestamp(primary))
        ? (secondary.created as unknown as string)
        : getCreationTimestamp(primary),
    },
    rormeta: {
      ...primary.rormeta,
    },
    kubernetescluster: {
      ...primary.kubernetescluster,
      spec: {
        ...primary.kubernetescluster?.spec,
        data: {
          ...primary.kubernetescluster?.spec?.data,
          clusterId: isEmptyValue(getClusterId(primary)) ? secondary.clusterId : getClusterId(primary),
          provider: isEmptyValue(getProvider(primary)) ? secondary.workspace.datacenter.provider : getProvider(primary),
          datacenter: isEmptyValue(getDatacenter(primary))
            ? secondary.workspace.datacenter.name
            : getDatacenter(primary),
          workspace: isEmptyValue(getWorkspace(primary)) ? secondary.workspace.name : getWorkspace(primary),
          environment: isEmptyValue(getEnvironment(primary))
            ? isEmptyValue(secondary.environment)
              ? undefined
              : secondary.environment
            : getEnvironment(primary),
        },
      },
      status: {
        ...primary.kubernetescluster?.status,
        state: {
          ...primary.kubernetescluster?.status?.state,
          cluster: {
            ...primary.kubernetescluster?.status?.state?.cluster,
            price: {
              monthly: isEmptyValue(getPrices(primary)?.monthly)
                ? secondary.metrics.priceMonth
                : getPrices(primary)?.monthly,
              yearly: isEmptyValue(getPrices(primary)?.yearly)
                ? secondary.metrics.priceYear
                : getPrices(primary)?.yearly,
            },
          },
        },
      },
    },
  }
}

export function oldMergeClusterData(primary: KubernetesCluster, secondary?: Cluster): KubernetesCluster {
  if (!secondary) return primary

  const mergedCluster: KubernetesCluster = {
    kind: primary.kind,
    apiVersion: primary.apiVersion,
    metadata: {
      name: isEmptyValue(primary.metadata?.name) ? secondary.clusterName : primary.metadata?.name,
      namespace: isEmptyValue(primary.metadata?.namespace) ? secondary.workspace.name : primary.metadata?.namespace,
      uid: primary.metadata?.uid,
      creationTimestamp: isEmptyValue(primary.metadata?.creationTimestamp)
        ? (secondary.created as unknown as string)
        : primary.metadata?.creationTimestamp,
    },
    rormeta: {
      version: primary.rormeta?.version,
      hash: primary.rormeta?.hash,
      ownerref: {
        scope: primary.rormeta?.ownerref?.scope || 'empty',
        subject: primary.rormeta?.ownerref?.subject || 'empty',
      },
      action: primary.rormeta?.action,
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
            ? isEmptyValue(secondary.environment)
              ? 'Not set'
              : secondary.environment
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
