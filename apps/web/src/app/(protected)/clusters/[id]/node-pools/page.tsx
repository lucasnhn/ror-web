import type { Metadata } from 'next'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { PageView } from './page-view'

interface NodePoolsPageProps {
  params: Promise<{ id: string }>
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
  nodeCount: number
  cores: number
  memory: number
  nodes: Node[]
  actions: React.ReactNode
}

interface NodePoolsPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'ROR - Node pools',
  description: 'View and manage node pools',
}

// const npNodes: Node[] = [
//   {
//     name: 'aclusterkind-np-1-pgmsg-cvjvs-l7nqq',
//     role: 'worker',
//     image: 'VMware Photon OS/Linux',
//     architecture: 'amd64',
//     cpu: '11% (224 mi / 2)',
//     memory: '50% (3.91 GiB / 7.68 GiB)',
//   },
//   {
//     name: 'aclusterkind-np-1-pgmsg-cvjvs-qlw82',
//     role: 'worker',
//     image: 'VMware Photon OS/Linux',
//     architecture: 'amd64',
//     cpu: '6% (133 mi / 2)',
//     memory: '53% (4.11 GiB / 7.68 GiB)',
//   },
// ]

// const workerNodes: Node[] = [
//   {
//     name: 'aclusterkind-workers-taint-xzxdr-bgjrh-7g2jt',
//     role: 'worker',
//     image: 'VMware Photon OS/Linux',
//     architecture: 'amd64',
//     cpu: '5% (107 mi / 2)',
//     memory: '31% (1.17 GiB / 3.74 GiB)',
//   },
// ]

// const NodepoolExamples: Nodepool[] = [
//   {
//     name: 'Np',
//     machineClass: 'best-effort-medium',
//     nodeCount: 2,
//     cores: 4,
//     memory: 15360000000,
//     nodes: npNodes,
//     actions: <button className='text-blue-500 hover:underline'>Edit</button>,
//   },
//   {
//     name: 'Workers',
//     machineClass: 'best-effort-small',
//     nodeCount: 1,
//     cores: 2,
//     memory: 37400000000,
//     nodes: workerNodes,
//     actions: <button className='text-blue-500 hover:underline'>Edit</button>,
//   },
// ]

export default async function NodePoolsPage({ params }: NodePoolsPageProps) {
  const { id } = await params
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  // 1) Hent alle noder for denne klyngen
  const nodesResp = await client.nodes.listByCluster(id)
  const allNodes = nodesResp?.resources ?? []
  console.log('All nodes in cluster:', allNodes) // first line info

  // 2) Hent kluster‐spesifikasjonen for å finne nodePools
  const clusterResp = await client.kubernetesClusters.id(id)
  const specPools = clusterResp?.kubernetescluster?.spec?.topology?.workers?.nodePools ?? []
  console.log('Node pools from cluster spec:', specPools) // first line info

  // 3) Mapper over hver pool og kobler på nodene
  const nodepools: Nodepool[] = specPools.map((pool) => {
    // Filtrer alle noder som hører til akkurat denne poolen
    const poolNodes: Node[] = allNodes
      // Replace 'nodePool' with the correct property, e.g. 'poolName', or skip this filter if not available
      .filter((n) => (n.node?.spec as any)?.nodePool === pool.name)
      .map((n) => ({
        name: String(n.metadata?.name ?? '<ukjent>'),
        role: n.node?.spec?.taints?.[0]?.effect ?? '<ukjent>',
        image: n.node?.status?.nodeInfo?.osImage ?? '<ukjent>',
        architecture: n.node?.status?.nodeInfo?.architecture ?? '<ukjent>',
        cpu: n.node?.status?.capacity?.cpu ?? '<ukjent>',
        memory: n.node?.status?.capacity?.memory ?? '<ukjent>',
      }))

    return {
      name: pool.name ?? '<ukjent>',
      machineClass: pool.machineClass ?? '<ukjent>',
      nodeCount: pool.replicas ?? 0,
      // Her kan du kalkulere cores & memory ut fra pool.replicas og evt. maskintype
      cores: (pool.replicas ?? 0) * 2, // Replace 2 with actual cores per node if available
      memory: (pool.replicas ?? 0) * 4096, // Replace 4096 with actual memory per node (e.g., in MiB) if available
      nodes: poolNodes,
      actions: <button className='text-blue-500 hover:underline'>Edit</button>,
    }
  })

  return (
    <div>
      <PageView data={nodepools} id={id} />
    </div>
  )
}
