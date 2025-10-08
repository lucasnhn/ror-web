/*
 * FILE OVERVIEW
 *
 * This file defines the column configuration for displaying node pool information in a table.
 * Each column specifies a header label and an accessor function to extract the corresponding value from a `Nodepool` object.
 * The columns include details such as Name, Machine Class, Node Count, Cores, Memory, Node Links, and Action buttons for editing and deleting node pools.
 */

'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { PencilIcon, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/shadcn/alert-dialog'
import { routes } from '@/config/routes'
import { deleteNodePoolAction } from '@/utils/node-pool-actions'
import { Button } from '@/components/shadcn/button'

interface Nodepool {
  name: string
  machineClass: string
  nodeCount: string
  cores: number
  memory: string
  nodes: unknown[]
  actions: React.ReactNode
}

/**
 * Generates the column definitions for the Node Pools table.
 *
 * @param id - The cluster identifier used to generate links and actions for each node pool.
 * @returns An array of column definitions (`ColumnDef<Nodepool>[]`) for rendering the node pools table, including expand/collapse, node pool details, node links, and action buttons (edit and delete).
 */
export function nodePoolsColumns(id: string): ColumnDef<Nodepool>[] {
  return [
    {
      id: 'expander',
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <div className='inline-flex w-fit'>
            <button
              onClick={row.getToggleExpandedHandler()}
              className='text-black dark:text-white'
              aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
            >
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
}
