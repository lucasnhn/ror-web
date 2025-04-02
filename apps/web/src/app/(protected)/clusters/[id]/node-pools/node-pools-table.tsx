'use client'
import { DataTable } from '@/components/ui/data-table'
import { Node } from '@ror/js-api-client'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Node>()

const columns = [
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

interface NodePoolsTableProps {
  nodes: Node[]
}

export function NodePoolsTable({ nodes }: NodePoolsTableProps) {
  const totalRows = Array.isArray(nodes) ? nodes.length : 0
  return <DataTable data={nodes} columns={columns} totalCount={totalRows} />
}
