'use client'

import { flexRender, type Table as TanStackTable } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableTitle,
  TableSubtitle,
  TableContainer,
  TableHeader,
} from '@ror/react/components/table'
import type { TableProps } from '@ror/react/components/table'
import { Fragment, useId } from 'react'

export interface DataViewProps<TData> extends Omit<TableProps, 'gridTemplateColumns'> {
  title?: string
  subtitle?: string
  table: TanStackTable<TData>
}

export function DataView<TData>({ title, subtitle, table, cellPadding }: DataViewProps<TData>) {
  const tableTitleId = useId()
  const tableSubtitleId = useId()
  const hasTitleOrSubtitle = title || subtitle

  console.log("table.getAllColumns()", table.getAllColumns())

  const numberOfColumns = table.getAllColumns().length 
  const gridTemplateColumns = `repeat(${numberOfColumns.toString()}, minmax(max-content, 1fr))`

  return (
    <Fragment>
      <TableContainer hasPagination>
        {hasTitleOrSubtitle ? (
          <div className='r-table__masthead'>
            {title && <TableTitle id={tableTitleId}>{title}</TableTitle>}
            {subtitle && <TableSubtitle id={tableSubtitleId}>{subtitle}</TableSubtitle>}
          </div>
        ) : null}

        <Table cellPadding={cellPadding} gridTemplateColumns={gridTemplateColumns}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // TODO: Find out how to do this correctly
                  // How should the fallback be rendered if the header is undefined?
                  // And if the header is a custom component how do we render it?
                  const child = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())

                  /**
                   * If the column is sortable, render the sortable th component
                   */
                  // if (header.column.getCanSort()) {
                  //   /**
                  //    * Get the current sorting direction for the column
                  //    * It maps the value from @tanstack/react-table to the @ror/react SortDirection enum
                  //    */
                  //   const sortingDirection = getSortingOrder(header)

                  //   /**
                  //    * Callback handler for when sort direction is changed
                  //    */
                  //   const handleOnToggleSort = (_id: string, nextDirection: SortDirection) => {
                  //     if (nextDirection === SortDirection.NONE) {
                  //       header.column.clearSorting()
                  //     } else {
                  //       const isDescending = nextDirection === SortDirection.DESC
                  //       header.column.toggleSorting(isDescending)
                  //     }
                  //   }

                  //   return (
                  //     <TableSortHeader
                  //       key={header.id}
                  //       id={header.id}
                  //       colSpan={header.colSpan}
                  //       direction={sortingDirection}
                  //       onToggleSort={handleOnToggleSort}
                  //     >
                  //       {child}
                  //     </TableSortHeader>
                  //   )
                  // }

                  return (
                    <TableHeader key={header.id} id={header.id} colSpan={header.colSpan}>
                      {child}
                    </TableHeader>
                  )
                })}
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
    </Fragment>
  )
}
