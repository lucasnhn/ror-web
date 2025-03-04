'use client'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableTitle,
  TableHeader,
  TableActions,
  TableSubtitle,
  TableContainer,
  TableSortHeader,
} from '@ror/react/components/table'
import type { TableProps } from '@ror/react/components/table'
import { SortDirection } from '@ror/react/utils/sorting'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Re-export of the ColumnDef type, that is typically used to define columns in a DataTable.
export type { ColumnDef }

export interface DataTableProps<TData> extends TableProps {
  /**
   * Specify a title for the table
   */
  title?: string

  /**
   * Specify a subtitle for the table
   */
  subtitle?: string

  /**
   * The data for the table to display.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#data)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  data: TData[]

  /**
   * The array of column defs to use for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  columns: ColumnDef<TData, any>[]
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  const { cellPadding, gridTemplateColumns, title, subtitle, data, columns } = props

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleOnSort = (id: string, direction: Exclude<SortDirection, 'NONE'>) => {
    console.log(`Sorting by ${id} in ${direction} order`)
  }

  return (
    <TableContainer>
      {title ? <TableTitle id='table-title'>{title}</TableTitle> : null}
      {subtitle ? <TableSubtitle id='table-subtitle'>{subtitle}</TableSubtitle> : null}
      <Table cellPadding={cellPadding} gridTemplateColumns={gridTemplateColumns}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableSortHeader key={header.id} id={header.id} direction={'NONE'} onToggleSort={handleOnSort}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableSortHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
