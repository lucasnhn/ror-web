'use client'

import { flexRender } from '@tanstack/react-table'
import type { Header, Table as TanStackTable } from '@tanstack/react-table'
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
  TableSortHeader,
} from '@ror/react/components/table'
import type { TableProps } from '@ror/react/components/table'
import { SortDirection } from '@ror/react/utils/sorting'
import { Fragment, useId } from 'react'
import { Pagination } from '@ror/react'

export interface DataViewProps<TData> extends Omit<TableProps, 'gridTemplateColumns'> {
  /**
   * Optional title of the data view table
   */
  title?: string
  /**
   * Optional subtitle of the data view table
   */
  subtitle?: string
  /**
   * The "table" instance to use
   * @example
   * import { useReactTable } from '@tanstack/react-table'
   * const tableInstance = useReactTable({
   *   data: [...],
   *   columns: [...],
   *   getSortedRowModel: getSortedRowModel(),
   * })
   * <DataView table={tableInstance} />
   */
  table: TanStackTable<TData>
}

export function DataView<TData>({ title, subtitle, table, cellPadding }: DataViewProps<TData>) {
  const tableTitleId = useId()
  const tableSubtitleId = useId()

  /**
   * Map between the @tanstack/table and the Table component sorting values
   */
  const getSortingOrder = <TData, TValue>(header: Header<TData, TValue>): SortDirection => {
    // Get the sorting direction from the header column
    const direction = header.column.getIsSorted()

    // Map it to the Table component sorting values
    if (direction === 'asc') {
      return SortDirection.ASC
    } else if (direction === 'desc') {
      return SortDirection.DESC
    }

    return SortDirection.NONE
  }

  const handleOnPaginationPageSizeChange = (pageSize: number) => {
    table.setPageSize(pageSize)
  }

  const hasTitleOrSubtitle = title || subtitle

<<<<<<< HEAD:apps/web/src/components/ui/data-view.tsx
  console.log("table.getAllColumns()", table.getAllColumns())

  const numberOfColumns = table.getAllColumns().length 
=======
  // Columns
  const numberOfColumns = table.getAllColumns().length
>>>>>>> d1ef3cfcbb59df9ec810c24c7f8fbc40ef355b5a:apps/web/src/components/ui/data-view/data-view.tsx
  const gridTemplateColumns = `repeat(${numberOfColumns.toString()}, minmax(max-content, 1fr))`

  const tableState = table.getState()

  // Pagination
  const pageSize = tableState.pagination.pageSize
  const pageSizeOptions = [10, 20, 30, 40, 50, 75, 100]
  const pageIndex = tableState.pagination.pageIndex + 1
  const pageCount = table.getPageCount()
  const paginationItemRangeText = `Page ${pageIndex} of ${pageCount}`

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
                  const child = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())

                  /**
                   * If the column is sortable, render the sortable th component
                   */
                  if (header.column.getCanSort()) {
                    /**
                     * Get the current sorting direction for the column
                     * It maps the value from @tanstack/react-table to the @ror/react SortDirection enum
                     */
                    const sortingDirection = getSortingOrder(header)

                    /**
                     * Callback handler for when sort direction is changed
                     */
                    const handleOnToggleSort = (_id: string, nextDirection: SortDirection) => {
                      if (nextDirection === SortDirection.NONE) {
                        header.column.clearSorting()
                      } else {
                        const isDescending = nextDirection === SortDirection.DESC
                        header.column.toggleSorting(isDescending)
                      }
                    }

                    return (
                      <TableSortHeader
                        key={header.id}
                        id={header.id}
                        colSpan={header.colSpan}
                        direction={sortingDirection}
                        onToggleSort={handleOnToggleSort}
                      >
                        {child}
                      </TableSortHeader>
                    )
                  }

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
      <Pagination
        itemRangeText={paginationItemRangeText}
        pageSize={pageSize}
        pageSizes={pageSizeOptions}
        onPageSizeChange={handleOnPaginationPageSizeChange}
        backwardsDisabled={!table.getCanPreviousPage()}
        forwardsDisabled={!table.getCanNextPage()}
        onForwards={() => table.nextPage()}
        onBackwards={() => table.previousPage()}
      />
    </Fragment>
  )
}
