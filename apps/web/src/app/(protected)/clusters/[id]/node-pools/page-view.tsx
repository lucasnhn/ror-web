'use client'

import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/shadcn/button'
import { PencilIcon, Plus, Trash } from 'lucide-react'
import { TableCell, TableRow } from '@ror/react/components/table/table'
import Link from 'next/link'
import { routes } from '@/config/routes'
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
import { Node } from '@ror/js-api-client'
import { deleteNodePoolAction } from '@/utils/node-pool-actions'

interface Nodepool {
  name: string
  machineClass: string
  nodeCount: string
  cores: number
  memory: string
  nodes: Node[]
}

const NodeCard = ({ node }: { node: Node }) => {
  return (
    <div className='rounded-lg border p-4 bg-[var(--r-layer)] dark:brightness-125 w-lg flex flex-col gap-2'>
      <h4 className='font-semibold text-xl text-wrap'>{node.metadata.name}</h4>
      <hr />
      <p className='flex items-center'>
        <span className='font-semibold'>tags: &nbsp;</span> {node.rormeta.tags?.join(', ')}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>addresses: &nbsp;</span>{' '}
        {node.node.status.addresses?.map((address) => `${address.type}=${address.address}`).join(', ')}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>cpu: &nbsp;</span> {node.node.status.capacity.cpu}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>ephemeralStorage: &nbsp;</span> {node.node.status.capacity.ephemeralStorage}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>memory: &nbsp;</span> {node.node.status.capacity.memory}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>pods: &nbsp;</span> {node.node.status.capacity.pods}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>conditions: &nbsp;</span>{' '}
        {node.node.status.conditions
          ?.map(
            (condition) =>
              `${condition.lastHeartbeatTime}, ${condition.lastTransitionTime}, ${condition.message}, ${condition.reason}, ${condition.status}, ${condition.type}`
          )
          .join(', ')}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>architecture: &nbsp;</span> {node.node.status.nodeInfo.architecture}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>bootID: &nbsp;</span> {node.node.status.nodeInfo.bootID}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>containerRuntimeVersion: &nbsp;</span>{' '}
        {node.node.status.nodeInfo.containerRuntimeVersion}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>kernelVersion: &nbsp;</span> {node.node.status.nodeInfo.kernelVersion}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>kubeProxyVersion: &nbsp;</span> {node.node.status.nodeInfo.kubeProxyVersion}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>kubeletVersion: &nbsp;</span> {node.node.status.nodeInfo.kubeletVersion}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>machineID: &nbsp;</span> {node.node.status.nodeInfo.machineID}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>operatingSystem: &nbsp;</span> {node.node.status.nodeInfo.operatingSystem}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>osImage: &nbsp;</span> {node.node.status.nodeInfo.osImage}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>systemUUID: &nbsp;</span> {node.node.status.nodeInfo.systemUUID}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>podCIDR: &nbsp;</span> {node.node.spec.podCIDR}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>podCIDRs: &nbsp;</span> {node.node.spec.podCIDRs}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>providerID: &nbsp;</span> {node.node.spec.providerID}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>taints: &nbsp;</span>{' '}
        {node.node.spec.taints?.map((taint) => `${taint.key}=${taint.effect}`).join(', ')}
      </p>
    </div>
  )
}

interface DataTableProps<TData> {
  data: TData[]
  id: string
}

export function PageView({ data, id }: DataTableProps<Nodepool>) {
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
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'machineClass',
      header: 'Machine Class',
    },
    {
      accessorKey: 'nodeCount',
      header: 'Node Count',
    },
    {
      accessorKey: 'cores',
      header: 'Cores',
    },
    {
      accessorKey: 'memory',
      header: 'Memory',
    },
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
            {/* edit */}
            <Link href={routes.app.editNodePool.getHref(id)}>
              <Button className='flex gap-2'>
                <PencilIcon className='h-5 w-5' />
              </Button>
            </Link>

            {/* delete */}
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

                  {/* The trick: bind params and pass the action to the form */}
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
    </div>
  )
}
