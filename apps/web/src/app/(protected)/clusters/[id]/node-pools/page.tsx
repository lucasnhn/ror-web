import type { Metadata } from 'next'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { PageView } from './page-view'
import { parseQuantity } from '@/utils/parse-quantity'
import { convertBytes } from '@/utils/bytes'
interface NodePoolsPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'ROR - Node pools',
  description: 'View and manage node pools',
}

interface Node {
  name: string
  role: string
  image: string
  architecture: string
  cpu: string
  memory: string
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

  const response = await client.nodes.listByCluster(id)
  const nodes = response?.resources ?? []

  const nodesObject: Node[] = nodes.map((node) => {
    const nodeMemory = node.node.status?.capacity?.memory || '0'
    const nodeMemoryConverted = convertMemory(nodeMemory)

    return {
      name: typeof node.metadata.name == 'string' ? node.metadata.name : 'Unnamed Node',
      role: 'worker', // TODO: node.metadata.labels?.['kubernetes.io/role'] ?
      image: node.node.status.nodeInfo.osImage,
      architecture: node.node.status.nodeInfo.architecture,
      cpu: node.node.status.capacity.cpu ? `${node.node.status.capacity.cpu}` : 'Data missing',
      memory: nodeMemoryConverted,
    }
  })

  // Find cluster data to retrieve nodePools
  const clusterResp = await client.kubernetesClusters.id(id)

  const nodePoolState = clusterResp?.kubernetescluster?.status?.state?.cluster?.nodepools ?? []
  const nodePoolSpec = clusterResp?.kubernetescluster?.spec?.topology?.workers?.nodePools ?? []

  const nodepoolsObjects: Nodepool[] = nodePoolState.map((pool) => {
    const spec = nodePoolSpec.find((spec) => spec.name === pool.name) || {}
    const replicas = spec.replicas ?? 0

    const nodesInPool = (pool.nodes ?? [])
      .map((nodeId: string) => nodesObject.find((node) => node.name === nodeId))
      .filter((node): node is Node => node !== undefined)

    const nodePoolMemory = pool.resources?.memory?.capacity || '0'
    const nodePoolMemooryConverted = convertMemory(nodePoolMemory)

    return {
      name: pool.name ?? 'Data missing',
      machineClass: pool.machineClass ?? '',
      nodeCount: `${pool.scale ?? 0} / ${replicas}`,
      cores: pool.resources?.cpu?.capacity ? Number(pool.resources?.cpu?.capacity) : 0,
      memory: nodePoolMemooryConverted,
      nodes: nodesInPool,
      actions: <button className='text-blue-500 hover:underline'>Edit</button>,
    }
  })

  return (
    <div>
      <PageView data={nodepoolsObjects} id={id} />
    </div>
  )
}
