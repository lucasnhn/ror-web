/*
 * FILE OVERVIEW:
 *
 * Utility functions for exporting Kubernetes cluster data in various formats.
 */

import { exportAsCSV, exportAsExcel } from '@/utils/export-utils'
import type { KubernetesCluster } from '@ror/js-api-client'

/**
 * Extracts and formats exportable information from a KubernetesCluster object.
 *
 * @param c - The KubernetesCluster object containing cluster data and metadata.
 * @returns An object with selected cluster properties including IDs, names, resource percentages,
 *          pricing, versions, node pool count, and service tags.
 */
const exportableFromCluster = (c: KubernetesCluster) => {
  const spec = c.kubernetescluster?.spec
  const data = spec?.data ?? {}
  const workers = spec?.topology?.workers?.nodePools ?? []

  const state = c.kubernetescluster?.status?.state ?? {}
  const cluster = state.cluster ?? {}
  const resources = cluster.resources ?? {}
  const price = cluster.price ?? {}
  const versions = state.versions ?? []

  const versionByName = (name: string) =>
    (versions as { name?: string | null; version?: string | null }[]).find((v) => v?.name === name)?.version ?? null

  const tagsArr = (c as any)?.rormeta?.tags ?? []
  const serviceTags = Array.isArray(tagsArr)
    ? tagsArr
        .map((t) => t?.value ?? t?.key ?? '')
        .filter(Boolean)
        .join(' ')
    : ''

  const nodePoolCount =
    Array.isArray(workers) && workers.length > 0
      ? workers.length
      : Array.isArray(cluster.nodepools)
        ? cluster.nodepools.length
        : null

  return {
    clusterId: data.clusterId ?? '',
    clusterName: c.metadata?.name ?? '',
    datacenter: data.datacenter ?? '',
    provider: data.provider ?? '',
    environment: data.environment ?? '',
    nodePoolCount,
    cpu: resources?.cpu?.percentage ?? null,
    memory: resources?.memory?.percentage ?? null,
    gpu: resources?.gpu?.percentage ?? null,
    disk: resources?.disk?.percentage ?? null,
    monthlyPrice: price?.monthly ?? null,
    yearlyPrice: price?.yearly ?? null,
    kubernetesVersion: versionByName('kubernetes'),
    agentVersion: versionByName('agent'),
    serviceTags,
  }
}

/**
 * Exports an array of Kubernetes clusters as a CSV file.
 *
 * @param clusters - The list of KubernetesCluster objects to export.
 * @param filename - The desired name for the exported CSV file.
 * @returns A promise or result from the exportAsCSV function, which handles the CSV generation and download.
 */
export const exportClustersAsCSV = (clusters: KubernetesCluster[], filename: string) =>
  exportAsCSV(clusters, filename, exportableFromCluster)

/**
 * Exports an array of Kubernetes clusters as an Excel file.
 *
 * @param clusters - The list of KubernetesCluster objects to export.
 * @param filename - The desired name for the exported Excel file.
 * @returns A promise or result from the exportAsExcel function, representing the export operation.
 */
export const exportClustersAsExcel = (clusters: KubernetesCluster[], filename: string) =>
  exportAsExcel(clusters, filename, exportableFromCluster, 'Clusters')
