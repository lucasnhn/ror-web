import type { Metadata } from 'next'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { rorApiClient } from '@/services/ror-api'
import { PageView } from './page-view'
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
  nodeCount: number
  cores: number
  memory: string
  nodes: Node[]
  actions: React.ReactNode
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
//     image: 'VMware Photon OS/Linux', // os image
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

  const response = await client.nodes.listByCluster(id)

  const nodes = response?.resources ?? [] // TODO: get nodes in nodepool (currently it list every node)
  console.log('Nodes:', nodes) // TODO: remove when API call is implemented, needed to build
  const nodesObject: Node[] = nodes.map((node) => ({
    name: typeof node.metadata.name == 'string' ? node.metadata.name : 'Unnamed Node',
    role: '', // TODO: node.metadata.labels?.['kubernetes.io/role'] ?
    image: node.node.status.nodeInfo.osImage,
    architecture: node.node.status.nodeInfo.architecture,
    cpu: node.node.status.capacity.cpu ? `${node.node.status.capacity.cpu} ` : 'Data missing',
    memory: `${node.node.status.capacity.memory} `, // TODO: format this to GiB
  }))

  // Find cluster data to retrieve nodePools
  const clusterResp = await client.kubernetesClusters.id(id)

  const nodePoolState = clusterResp?.kubernetescluster?.status?.state?.cluster?.nodepools ?? []
  const nodePoolSpec = clusterResp?.kubernetescluster?.spec?.topology?.workers?.nodePools ?? []

  const nodepoolsObjects: Nodepool[] = nodePoolState.map((pool) => ({
    //const nodesInPool = nodes.filter((node) => node.metadata?.labels?.['kubernetes.io/cluster/nodepool'] === pool.name)

    name: pool.name ?? 'Data missing',
    machineClass: pool.machineClass ?? '',
    nodeCount: pool.scale ?? 0, // TODO: check if this is correct
    cores: pool.resources?.cpu?.capacity ? Number(pool.resources?.cpu?.capacity) : 0, // TODO: check if this is correct or if it should be "used" instead of capacity
    memory: pool.resources?.memory?.capacity ?? 'Data missing',
    nodes: nodesObject, // TODO: fetched Node separately
    actions: <button className='text-blue-500 hover:underline'>Edit</button>,
  }))

  return (
    <div>
      <PageView data={nodepoolsObjects} id={id} />
    </div>
  )
}
