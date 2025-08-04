import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { convertBytes } from '@/utils/bytes'
import { parseQuantity } from '@/utils/parse-quantity'
import { Node } from '@ror/js-api-client'
import type { Metadata } from 'next'
import { PageView } from './page-view'

interface NodePoolsPageProps {
  params: Promise<{ id: string }>
}

interface Nodepool {
  name: string
  machineClass: string
  nodeCount: string
  cores: number
  memory: string
  nodes: Node[]
  actions: React.ReactNode
}

export const metadata: Metadata = {
  title: 'ROR - Node pools',
  description: 'View and manage node pools',
}

function convertMemory(memory: string): string {
  const memoryBytes = parseQuantity(memory)
  const memoryGiB = memoryBytes / 1024 ** 3
  const decimals = memoryGiB.toFixed(2).split('.')[1]

  const roundingPrecision = decimals === '00' ? 0 : 2

  return convertBytes(memoryBytes, {
    useBinaryUnits: true, // KiB/MiB/GiB...
    roundingPrecision,
    includeUnit: true,
    localizeOptions: {
      language: 'en',
      plurals: { one: 'Byte', other: 'Bytes' },
    },
  })
}

export default async function NodePoolsPage({ params }: NodePoolsPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  const nodes = (await client.nodes.listByCluster(id))?.resources ?? []
  const cluster = (await client.kubernetesClusters.id(id))?.kubernetescluster

  const statePools = cluster?.status?.state?.cluster?.nodepools ?? []
  const specPools = cluster?.spec?.topology?.workers?.nodePools ?? []

  const nodePools: Nodepool[] = statePools.map((pool) => {
    const spec = specPools.find((s) => s.name === pool.name)
    const replicas = spec?.replicas ?? 0

    const nodesInPool = (pool.nodes ?? [])
      .map((nodeId) => nodes.find((node) => node.metadata.name === nodeId))
      .filter((node): node is Node => !!node)

    return {
      name: pool.name ?? 'Data missing',
      machineClass: pool.machineClass ?? '',
      nodeCount: `${pool.scale ?? 0} / ${replicas}`,
      cores: Number(pool.resources?.cpu?.capacity ?? 0),
      memory: convertMemory(pool.resources?.memory?.capacity ?? '0'),
      nodes: nodesInPool,
      actions: <button className='text-blue-500 hover:underline'>Edit</button>,
    }
  })

  return <PageView data={nodePools} id={id} />
}
