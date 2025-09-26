import type { KubernetesCluster } from '@ror/js-api-client'
import type { HealthStatus } from '../types/health-status'
import { normalizeHealthStatus } from './health'
import { ResourceType } from '../types/resource'

export const getClusterId = (cluster: KubernetesCluster): string =>
  cluster?.kubernetescluster?.spec?.data?.clusterId || 'Unknown Cluster'

/**
 * Retrieves the name of a Kubernetes cluster from the provided cluster object.
 *
 * @param cluster - The Kubernetes cluster object to extract the name from.
 * @returns The name of the cluster, or `'Unknown Cluster'` if not found.
 */
export const getClusterName = (cluster: KubernetesCluster): string =>
  cluster?.metadata?.name || cluster?.kubernetescluster?.spec?.data?.clusterId || 'Unknown Cluster'

interface RawCondition {
  type?: string | null
  status?: string | null
  message?: string | null
  reason?: string | null
  lastTransitionTime?: string | null
}

/**
 * Represents a health condition that has been normalized to use a standardized health status.
 * Extends {@link RawCondition} and replaces the `status` property with a {@link HealthStatus}.
 *
 * @remarks
 * This interface is useful for ensuring that health conditions conform to a consistent status type
 * throughout the application.
 *
 * @see RawCondition
 * @see HealthStatus
 */
export interface NormalizedHealthCondition extends RawCondition {
  status: HealthStatus
}

/**
 * Extracts and normalizes the 'ready' condition from a list of cluster conditions.
 */
export function getHealthCondition(
  cluster: KubernetesCluster | null | undefined
): NormalizedHealthCondition | undefined {
  const rawCondition = cluster?.kubernetescluster?.status?.conditions?.find((condition) => condition?.type === 'ready')

  if (!rawCondition) return undefined

  return {
    ...rawCondition,
    status: normalizeHealthStatus(rawCondition.status),
  }
}

export function getClusterResource(
  cluster: KubernetesCluster,
  type: ResourceType
): { capacity?: string; used?: string; percentage?: number | null } {
  const resource = cluster?.kubernetescluster?.status?.state?.cluster?.resources?.[type]
  return {
    capacity: resource?.capacity ?? undefined,
    used: resource?.used ?? undefined,
    percentage: resource?.percentage ?? null,
  }
}

export function getTools(cluster: KubernetesCluster) {
  return {
    argo: cluster?.kubernetescluster?.status?.state?.endpoints?.find((endpoint) => endpoint.name === 'argocd')?.address,
    grafana: cluster?.kubernetescluster?.status?.state?.endpoints?.find((endpoint) => endpoint.name === 'grafana')
      ?.address,
  }
}

export function getPrices(cluster: KubernetesCluster) {
  return {
    monthly: cluster?.kubernetescluster?.status?.state?.cluster?.price?.monthly || 0,
    yearly: cluster?.kubernetescluster?.status?.state?.cluster?.price?.yearly || 0,
  }
}

export const getLastObserved = (cluster: KubernetesCluster): Date | null | undefined =>
  cluster?.kubernetescluster?.status?.state?.lastUpdated

export const getCreated = (cluster: KubernetesCluster): Date | null | undefined =>
  cluster?.kubernetescluster?.status?.state?.created

export const getEnvironment = (cluster: KubernetesCluster): string =>
  cluster?.kubernetescluster?.spec?.data?.environment ?? 'unknown'

export const getServerUrl = (cluster: KubernetesCluster): string =>
  cluster?.kubernetescluster?.status?.state?.endpoints?.find((endpoint) => endpoint.name === 'datacenter')?.address ||
  '<missing>'

export const getRorLogin = (cluster: KubernetesCluster): string => `ror login ${getClusterId(cluster)}`

export const getKubectlLogin = (cluster: KubernetesCluster, userEmail: string): string =>
  `kubectl vsphere login --server=${getServerUrl(cluster)} -u ${userEmail} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${cluster.kubernetescluster?.spec?.data?.workspace} --tanzu-kubernetes-cluster-name ${getClusterName(cluster)}`

export function getHaClusterPlaneValue(cluster: KubernetesCluster) {
  const nodeNum = cluster?.kubernetescluster?.spec?.topology?.controlplane?.replicas ?? 0
  if (nodeNum > 1) {
    return 'Yes'
  } else if (nodeNum === 1) {
    return 'No'
  } else {
    return ''
  }
}

interface Version {
  name: string
  version: string
  branch: string
}

interface ClusterVersions {
  agent: Version
  kubernetes: Version
  nhnTooling: Version
}

export function getVersions(cluster: KubernetesCluster): ClusterVersions {
  const versions = cluster?.kubernetescluster?.status?.state?.versions || []

  const findOrDefault = (key: string, displayName: string): Version => {
    const found = versions.find((v) => v.name === key)

    return {
      name: found?.name ?? displayName,
      version: found?.version ?? 'Version missing',
      branch: found?.branch ?? '',
    }
  }

  return {
    agent: findOrDefault('agent', 'Agent'),
    kubernetes: findOrDefault('kubernetes', 'Kubernetes'),
    nhnTooling: findOrDefault('nhnTooling', 'NHN Tooling'),
  }
}

export const getProject = (cluster: KubernetesCluster): string =>
  cluster?.kubernetescluster?.spec?.data?.project || 'No project assigned'

export const getWorkspace = (cluster: KubernetesCluster): string =>
  cluster?.kubernetescluster?.spec?.data?.workspace || 'No workspace assigned'

export const getDatacenter = (cluster: KubernetesCluster): string =>
  cluster?.kubernetescluster?.spec?.data?.datacenter || 'No data center assigned'

export const getProvider = (cluster: KubernetesCluster): string =>
  cluster?.kubernetescluster?.spec?.data?.provider || 'No provider assigned'

export interface ServiceTag {
  key: string
  value: string
  properties: Record<string, string>
}

export const getRormetaTags = (cluster: KubernetesCluster): ServiceTag[] => cluster.rormeta.tags || []

export const getNodePools = (cluster: KubernetesCluster) =>
  cluster?.kubernetescluster?.spec?.topology?.workers?.nodePools || []
