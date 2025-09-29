import type { KubernetesCluster } from '@ror/js-api-client'
import type { WorkSheet } from 'xlsx'

type WorksheetWithCols = WorkSheet & { ['!cols']?: { wch: number }[] }
type RorTag = { key?: string; value?: string; properties?: { color?: string } }
type WithRorMeta = KubernetesCluster & { rormeta?: { tags?: RorTag[] } }

const exportableFromCluster = (c: KubernetesCluster) => {
  const spec = c.kubernetescluster?.spec
  const data = spec?.data ?? {}
  const workers = spec?.topology?.workers?.nodePools ?? []

  const state = c.kubernetescluster?.status?.state ?? {}
  const cluster = state.cluster ?? {}
  const resources = cluster.resources ?? {}
  const price = cluster.price ?? {}

  const versions = state.versions ?? []
  type Version = { name?: string | null; version?: string | null }
  const versionByName = (name: string) => (versions as Version[]).find((v) => v?.name === name)?.version ?? null

  const tagsArr = (c as WithRorMeta)?.rormeta?.tags ?? []
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
    clusterId: data?.clusterId ?? '',
    clusterName: c.metadata?.name ?? '',
    workspaceName: data?.workspace ?? '',
    datacenterName: data?.datacenter ?? '',
    provider: data?.provider ?? '',
    environment: data?.environment ?? '',

    cpuPercentage: resources?.cpu?.percentage ?? null,
    memoryPercentage: resources?.memory?.percentage ?? null,
    gpuPercentage: resources?.gpu?.percentage ?? null,
    diskPercentage: resources?.disk?.percentage ?? null,
    nodePoolCount,

    monthlyPrice: price?.monthly ?? null,
    yearlyPrice: price?.yearly ?? null,

    rorAgentVersion: versionByName('agent'),
    kubernetesVersion: versionByName('kubernetes'),
    nhnToolingVersion: versionByName('nhnTooling'),

    serviceTags,
  }
}

const toCSV = (rows: Array<Record<string, unknown>>) => {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const esc = (v: unknown) => {
    if (v == null) return ''
    const s = String(v)
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const row of rows) lines.push(headers.map((h) => esc(row[h])).join(','))
  return lines.join('\n')
}

const downloadBlob = (content: string, filename: string, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const autosizeCols = (rows: Array<Record<string, unknown>>) => {
  if (!rows.length) return []
  const headers = Object.keys(rows[0])
  return headers.map((h) => {
    const maxLen = Math.max(h.length, ...rows.map((r) => (r[h] == null ? 0 : String(r[h]).length)))
    return { wch: Math.min(Math.max(maxLen + 2, 10), 40) }
  })
}

export const exportClustersAsCSV = (clusters: KubernetesCluster[], filename: string) => {
  try {
    const rows = clusters.map(exportableFromCluster)
    const csv = toCSV(rows)
    if (!csv) return console.warn('[Export] No data to export')
    downloadBlob(csv, filename)
  } catch (e) {
    console.error('[Export] CSV export failed', e)
  }
}

export const exportClustersAsExcel = async (clusters: KubernetesCluster[], filename: string) => {
  try {
    const rows = clusters.map(exportableFromCluster)
    if (!rows.length) return console.warn('[Export] No data to export')
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(rows) as WorksheetWithCols
    ws['!cols'] = autosizeCols(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Clusters')
    XLSX.writeFile(wb, filename, { bookType: 'xlsx' })
  } catch (e) {
    console.error('[Export] Excel export failed', e)
  }
}
