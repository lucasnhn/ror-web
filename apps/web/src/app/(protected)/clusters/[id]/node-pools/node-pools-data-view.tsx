'use client'

import { DataView } from '@/components/ui/data-view'
import type { Node } from '@ror/js-api-client'
import { ColumnDef, createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Node>()

export const columns = [
  columnHelper.accessor('metadata.name', {
    id: 'name',
    header: 'Name',
  }),
  columnHelper.accessor('node.status.nodeInfo.osImage', {
    header: 'OS Image',
  }) as ColumnDef<Node>,
  columnHelper.accessor('node.status.nodeInfo.architecture', {
    header: 'Architecture',
  }) as ColumnDef<Node>,
] satisfies ColumnDef<Node>[]

interface NodePoolsDataViewProps {
  nodes: Node[]
}

export function NodePoolsDataView({ nodes }: NodePoolsDataViewProps) {
  const tablecontent = useReactTable({
    data: nodes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  return <DataView table={tablecontent} />
}
