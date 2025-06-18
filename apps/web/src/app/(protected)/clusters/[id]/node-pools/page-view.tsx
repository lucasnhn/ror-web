'use client'

import { convertBytes } from '@/utils/bytes'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import React, { useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/shadcn/button'
import { PencilIcon, Plus, Trash } from 'lucide-react'
import { TableCell, TableRow } from '@ror/react/components/table/table'
import Link from 'next/link'
import { routes } from '@/config/routes'

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
}

const NodeCard = ({ node }: { node: Node }) => {
  return (
    <div className='rounded-lg border p-4 bg-[var(--r-layer)] dark:brightness-125 w-lg flex flex-col gap-2'>
      <h4 className='font-semibold text-xl text-wrap'>{node.name}</h4>
      <hr />
      <p className='flex items-center'>
        <span className='font-semibold'>Role: &nbsp;</span> {node.role}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>Image: &nbsp;</span> {node.image}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>Arch: &nbsp;</span> {node.architecture}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>CPU: &nbsp;</span> {node.cpu}
      </p>
      <p className='flex items-center'>
        <span className='font-semibold'>Memory: &nbsp;</span> {node.memory}
      </p>
    </div>
  )
}

interface DataTableProps<TData> {
  data: TData[]
  id: string
}

export function PageView({ data, id }: DataTableProps<Nodepool>) {
  const [remove, setRemove] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortingState>([])

  // TODO: remove this when the edit and remove modals are implemented, needed to build
  console.log('Remove:', remove)

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
      cell: ({ row }) => convertBytes(row.original.memory),
    },
    {
      accessorKey: 'nodes',
      header: 'Node links',
      cell: () => (
        <Link href='nodes' className='text-blue-500 dark:text-blue-600 hover:underline'>
          Nodes
        </Link>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: () => (
        <div className='flex gap-2'>
          <Link href={routes.app.editNodePool.getHref(id)}>
            <Button className='flex gap-2'>
              <PencilIcon className='h-5 w-5' />
            </Button>
          </Link>
          <Button className='flex gap-2' onClick={() => setRemove(true)} variant='destructive'>
            <Trash className='h-5 w-5' />
          </Button>
        </div>
      ),
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
        sorting={sorting}
        onSortingChange={setSorting}
        renderExpandedRow={(row) => (
          <TableRow className='contents'>
            <TableCell colSpan={columns.length} className='p-0' style={{ gridColumn: '1 / -1' }}>
              <div className='w-full bg-[var(--r-layer)] brightness-102 dark:brightness-110 px-4 py-4'>
                <div className='flex flex-wrap gap-4'>
                  {(row.original as Nodepool).nodes.map((node) => (
                    <NodeCard key={node.name} node={node} />
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
