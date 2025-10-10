import { CodeSnippet } from '@/components/ui/code-snippet'
import { getRorApi } from '@/services/ror-api'
import { VulnerabilityReport } from '@ror/js-api-client'

export default async function ClusterVulnerabilitiesPage() {
  const api = await getRorApi()
  const listParams = new URLSearchParams()
  const res = await api.datacenter.list(listParams)
  const items: VulnerabilityReport[] = res?.resources ?? []

  return <CodeSnippet type={'multi'}>{JSON.stringify(items, null, 2)}</CodeSnippet>
}
