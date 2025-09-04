'use client'

import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/shadcn/button'
import { PencilIcon, Plus, Trash } from 'lucide-react'
import { TableCell, TableRow } from '@ror/react/components/table/table'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/shadcn/alert-dialog'
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog'
import type { Node } from '@ror/js-api-client'
import { routes } from '@/config/routes'
import { useClusterContext } from '@/context/cluster-context'
import { convertBytes } from '@/utils/bytes'
import { getNodesInPool } from '@/utils/get-nodes-in-pool'
import { deleteNodePoolAction } from '@/utils/node-pool-actions'
import { parseQuantity } from '@/utils/parse-quantity'

interface PageViewProps {
  id: string
  initialNodes: Node[]
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
    useBinaryUnits: true,
    roundingPrecision,
    includeUnit: true,
    localizeOptions: { language: 'en', plurals: { one: 'Byte', other: 'Bytes' } },
  })
}

const NodeCard = ({ node }: { node: Node }) => (
  <div className='rounded-lg border p-4 bg-[var(--r-layer)] dark:brightness-125 w-lg flex flex-col gap-2 *:font-semibold'>
    <h4 className='text-xl text-wrap'>{node.metadata.name}</h4>
    <hr />
    <p>
      <span>tags:&nbsp;</span>
      {node.rormeta.tags?.join(', ')}
    </p>
    <p>
      <span>addresses:&nbsp;</span>
      {node.node.status.addresses?.map((a) => `${a.type}=${a.address}`).join(', ')}
    </p>
    <p>
      <span>cpu:&nbsp;</span>
      {node.node.status.capacity.cpu}
    </p>
    <p>
      <span>ephemeralStorage:&nbsp;</span>
      {node.node.status.capacity.ephemeralStorage}
    </p>
    <p>
      <span>memory:&nbsp;</span>
      {node.node.status.capacity.memory}
    </p>
    <p>
      <span>pods:&nbsp;</span>
      {node.node.status.capacity.pods}
    </p>
    <p>
      <span>conditions:&nbsp;</span>
      {node.node.status.conditions
        ?.map(
          (c) => `${c.lastHeartbeatTime}, ${c.lastTransitionTime}, ${c.message}, ${c.reason}, ${c.status}, ${c.type}`
        )
        .join(', ')}
    </p>
    <p>
      <span>architecture:&nbsp;</span>
      {node.node.status.nodeInfo.architecture}
    </p>
    <p>
      <span>bootID:&nbsp;</span>
      {node.node.status.nodeInfo.bootID}
    </p>
    <p>
      <span>containerRuntimeVersion:&nbsp;</span>
      {node.node.status.nodeInfo.containerRuntimeVersion}
    </p>
    <p>
      <span>kernelVersion:&nbsp;</span>
      {node.node.status.nodeInfo.kernelVersion}
    </p>
    <p>
      <span>kubeProxyVersion:&nbsp;</span>
      {node.node.status.nodeInfo.kubeProxyVersion}
    </p>
    <p>
      <span>kubeletVersion:&nbsp;</span>
      {node.node.status.nodeInfo.kubeletVersion}
    </p>
    <p>
      <span>machineID:&nbsp;</span>
      {node.node.status.nodeInfo.machineID}
    </p>
    <p>
      <span>operatingSystem:&nbsp;</span>
      {node.node.status.nodeInfo.operatingSystem}
    </p>
    <p>
      <span>osImage:&nbsp;</span>
      {node.node.status.nodeInfo.osImage}
    </p>
    <p>
      <span>systemUUID:&nbsp;</span>
      {node.node.status.nodeInfo.systemUUID}
    </p>
    <p>
      <span>podCIDR:&nbsp;</span>
      {node.node.spec.podCIDR}
    </p>
    <p>
      <span>podCIDRs:&nbsp;</span>
      {node.node.spec.podCIDRs}
    </p>
    <p>
      <span>providerID:&nbsp;</span>
      {node.node.spec.providerID}
    </p>
    <p>
      <span>taints:&nbsp;</span>
      {node.node.spec.taints?.map((t) => `${t.key}=${t.effect}`).join(', ')}
    </p>
  </div>
)

export function PageView({ id, initialNodes }: PageViewProps) {
  const { cluster } = useClusterContext()

  const nodes = initialNodes

  const data = React.useMemo(() => {
    const statePools = cluster?.kubernetescluster?.status?.state?.cluster?.nodepools ?? []
    const specPools = cluster?.kubernetescluster?.spec?.topology?.workers?.nodePools ?? []

    return statePools.map((pool) => {
      const spec = specPools.find((s) => s?.name === pool?.name)
      const replicas = spec?.replicas ?? 0
      const nodesInPool = getNodesInPool(pool?.nodes, nodes, pool?.name ?? undefined)

      return {
        name: pool?.name ?? 'Data missing',
        machineClass: pool?.machineClass ?? '',
        nodeCount: `${pool?.scale ?? 0} / ${replicas}`,
        cores: Number(pool?.resources?.cpu?.capacity ?? 0),
        memory: convertMemory(pool?.resources?.memory?.capacity ?? '0'),
        nodes: nodesInPool,
        actions: <button className='text-blue-500 hover:underline'>Edit</button>,
      }
    })
  }, [cluster, nodes])

  const columns: ColumnDef<Nodepool>[] = [
    {
      id: 'expander',
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <div className='inline-flex w-fit'>
            <button onClick={row.getToggleExpandedHandler()} className='text-black dark:text-white'>
              {row.getIsExpanded() ? '▼' : '▶'}
            </button>
          </div>
        ) : null,
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'machineClass', header: 'Machine Class' },
    { accessorKey: 'nodeCount', header: 'Node Count' },
    { accessorKey: 'cores', header: 'Cores' },
    { accessorKey: 'memory', header: 'Memory' },
    {
      accessorKey: 'nodes',
      header: 'Node links',
      cell: ({ row }) => {
        const pool = row.original as Nodepool
        return (
          <Link
            href={routes.app.nodes.getHref(id, pool.name)}
            className='text-blue-500 dark:text-blue-600 hover:underline'
          >
            Nodes
          </Link>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const pool = row.original as Nodepool
        return (
          <div className='flex gap-2'>
            <Link href={routes.app.editNodePool.getHref(id, pool.name)}>
              <Button className='flex gap-2'>
                <PencilIcon className='h-5 w-5' />
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='flex gap-2' variant='destructive'>
                  <Trash className='h-5 w-5' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-2xl'>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>Deleting this node pool cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant='outline'>Cancel</Button>
                  </AlertDialogCancel>

                  <form action={deleteNodePoolAction.bind(null, id, pool.name)}>
                    <AlertDialogAction asChild className='bg-red-500 dark:bg-red-600'>
                      <Button type='submit' variant='destructive'>
                        Delete
                      </Button>
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Link href={routes.app.newNodePool.getHref(id)}>
        <Button>
          <Plus />
          Create nodepool
        </Button>
      </Link>

      {data.length > 0 ? (
        <DataTable
          columns={columns}
          data={data}
          totalCount={data.length}
          expandable
          renderExpandedRow={(row) => (
            <TableRow className='contents'>
              <TableCell colSpan={columns.length} className='p-0' style={{ gridColumn: '1 / -1' }}>
                <div className='w-full bg-[var(--r-layer)] brightness-102 dark:brightness-110 px-4 py-4'>
                  <div className='flex flex-wrap gap-4'>
                    {(row.original as Nodepool).nodes.map((node) => (
                      <NodeCard key={node.metadata.uid} node={node} />
                    ))}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        />
      ) : (
        <p>Cluster does not have node pools</p>
      )}
    </div>
  )
}
