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

  return (
    <div className='w-full flex flex-col'>
      <Header title='Statistics' />
      <PageView
        kubernetesVersions={findVersions(items).kubernetesCount}
        agentVersions={findVersions(items).agentCount}
        nhnToolingVersion={findVersions(items).nhnToolingCount}
      />
    </div>
  )
}

export default StatisticsPage
