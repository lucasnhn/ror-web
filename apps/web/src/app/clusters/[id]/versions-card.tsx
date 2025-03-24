'use client'
import type { Cluster } from '@ror/js-api-client'
import clsxm from '@/utils/clsxm'
import { Tile, DefinitionDescription, DefinitionList, DefinitionTerm } from '@ror/react'

interface ClusterVersionsCardProps {
  cluster: Cluster
  className?: string
}

export function ClusterVersionsCard({ cluster, className }: ClusterVersionsCardProps) {
  const classes = clsxm('p-5', className)

  const nhnToolingVersion = cluster.versions.nhnTooling.version
  const nhnToolingBranch = cluster.versions.nhnTooling.branch
  const nhnToolingValue =
    nhnToolingVersion !== 'Missing ...' ? `${nhnToolingVersion} (${nhnToolingBranch})` : 'Missing …'

  const agentVersion = cluster.versions.agent?.version
  const agentSha = cluster.versions.agent?.sha
  const agentValue = `${agentVersion} (${agentSha})`

  return (
    <Tile className={classes}>
      <div className=''>
        <h3 className='heading-01 pb-3 mb-5 border-b border-b-(--r-border-subtle)'>Versions</h3>
        <DefinitionList>
          <DefinitionTerm>NHN-tooling</DefinitionTerm>
          <DefinitionDescription>{nhnToolingValue}</DefinitionDescription>

          <DefinitionTerm>Agent</DefinitionTerm>
          <DefinitionDescription>{agentValue}</DefinitionDescription>

          <DefinitionTerm>Kubernetes</DefinitionTerm>
          <DefinitionDescription>{cluster.versions.kubernetes}</DefinitionDescription>
        </DefinitionList>
      </div>
    </Tile>
  )
}
