import { getVersions } from '@/features/cluster/utils/cluster'
import { KubernetesCluster } from '@ror/js-api-client'

export const findVersions = (clusters: KubernetesCluster[]) => {
  const kubernetesCount: Record<string, number> = {}
  const agentCount: Record<string, number> = {}
  const nhnToolingCount: Record<string, number> = {}

  clusters.forEach((cluster) => {
    const versions = getVersions(cluster)
    const kubeVersion = versions.kubernetes?.version
    const agentVersion = versions.agent?.version
    const nhnToolingVersion = versions.nhnTooling?.version

    if (!kubeVersion || kubeVersion === 'Version missing') return
    if (!agentVersion || agentVersion === 'Version missing') return
    if (!nhnToolingVersion || nhnToolingVersion === 'Version missing') return

    kubernetesCount[kubeVersion] = (kubernetesCount[kubeVersion] || 0) + 1
    agentCount[agentVersion] = (agentCount[agentVersion] || 0) + 1
    nhnToolingCount[nhnToolingVersion] = (nhnToolingCount[nhnToolingVersion] || 0) + 1
  })

  return { kubernetesCount, agentCount, nhnToolingCount }
}
