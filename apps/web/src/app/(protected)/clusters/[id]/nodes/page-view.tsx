import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

interface PageViewProps {
  // data:
}

interface DataTableProps<TData> {
  data: TData[]
  id: string
}

export const PageView = ({}: PageViewProps, { data, id }: DataTableProps<Node>) => {
  const columns: ColumnDef<Node>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'image',
      header: 'Image',
    },
    {
      accessorKey: 'architecture',
      header: 'Architecture',
    },
    {
      accessorKey: 'cpu',
      header: 'CPU',
    },
    {
      accessorKey: 'memory',
      header: 'Memory',
    },
    {
      id: 'details',
      header: 'Details',
      // cell: ({ row }) => <NodeCard node={row.original} />,
    },
  ]
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Node Details</h1>
      <DataTable columns={columns} data={data} totalCount={data.length} />
    </div>
  )
  return <div></div>
}
