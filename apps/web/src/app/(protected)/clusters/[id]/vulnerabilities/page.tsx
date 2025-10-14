import { VulnerabilitiesTable } from '@/features/vulnerabilities/components/vulnerabilites-table'
import { getRorApi } from '@/services/ror-api'
import type { VulnerabilityReport } from '@ror/js-api-client'

export default async function ClusterVulnerabilitiesPage() {
  const api = await getRorApi()
  const listParams = new URLSearchParams()
  const res = await api.vulnerabilityReport.list(listParams)
  const items: VulnerabilityReport[] = res?.resources ?? []

  return <VulnerabilitiesTable items={items} />
}
