import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'
import { KubernetesCluster } from '@ror/js-api-client'
import { getRorApi } from '@/services/ror-api'
import { findVersions } from '@/features/statistics/utils/versions'

const StatisticsPage = async () => {
  const api = await getRorApi()
  const listParams = new URLSearchParams()
  const res = await api.kubernetesClusters.list(listParams)
  const items: KubernetesCluster[] = res?.resources ?? []

  const { kubernetesCount, agentCount, nhnToolingCount } = findVersions(items)

  return (
    <div className='w-full flex flex-col'>
      <Header title='Statistics' />
      <PageView kubernetesVersions={kubernetesCount} agentVersions={agentCount} nhnToolingVersion={nhnToolingCount} />
    </div>
  )
}

export default StatisticsPage
