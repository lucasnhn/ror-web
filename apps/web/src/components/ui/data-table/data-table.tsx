'use client'
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
import { Pagination } from '@ror/react/components/pagination'
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef, PaginationState, Row } from '@tanstack/react-table'
import { getItemRangeText } from './pagination'
import { Fragment, useId } from 'react'

/**
 * DataTableColumnDef is a type that represents a column definition for a DataTable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumnDef<TData> = ColumnDef<TData, any>

export type DataTablePagination = PaginationState

export interface DataTableProps<TData> extends Omit<TableProps, 'gridTemplateColumns'> {
  /**
   * Specify a title for the table
   */
  title?: string

  /**
   * Specify a subtitle for the table
   */
  subtitle?: string

  /**
   * The array of column defs to use for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  columns: ColumnDef<TData>[]

  /**
   * The data for the table to display.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#data)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  data: TData[]

  /**
   * Provide the number of total rows
   */
  totalCount: number

  /**
   * The current state of pagination
   */
  pagination?: DataTablePagination

  /**
   * The callback when pagination changes
   */
  onPaginationChange?: (state: DataTablePagination) => void

  /**
   * Provide the number of pages available for pagination
   */
  pageCount?: number

  /**
   * Provide a custom set of different page sizes
   * e.g. [10, 25, 50, 100]
   */
  pageSizes?: number[]

  /**
   * If true, table will be expandable
   * @default false
   */
  expandable?: boolean

  renderExpandedRow?: (row: Row<TData>) => React.ReactNode
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  const {
    cellPadding,
    title,
    subtitle,
    columns,
    data,
    totalCount,
    pagination = { pageIndex: 0, pageSize: 10 },
    onPaginationChange,
    pageCount,
    pageSizes = [10, 25, 50, 100],
    expandable = false,
  } = props

  const tableTitleId = useId()
  const tableSubtitleId = useId()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => expandable,

    /**
     * The table needs information about the total number of rows and pages.
     * When we control the pagination manually
     */
    rowCount: totalCount,
    pageCount,

    /*
     * Control the pagination ourselves
     * This assumes that the data is already and paginated.
     */
    manualPagination: true,

    /**
     * Trigger callback when pagination changes
     */
    onPaginationChange: (updater) => {
      if (props.pagination && typeof onPaginationChange === 'function') {
        const newValue = updater instanceof Function ? updater(props.pagination) : updater
        onPaginationChange(newValue)
      }
    },

    /**
     * The controlled pagination state
     */
    state: {
      pagination,
    },
  })

  const handleOnPageSizeChange = (pageSize: number) => {
    /**
     * A page size change means we need to reset to the first page
     */
    table.resetPageIndex()
    table.setPageSize(pageSize)
  }

  const handleOnPaginationBackwards = () => {
    table.previousPage()
  }

  const handleOnPaginationForwards = () => {
    table.nextPage()
  }

  // The current page in the pagination
  const currentPage = table.getState().pagination.pageIndex
  // The selected number of items to show per page
  const paginationPageSize = table.getState().pagination.pageSize

  // Generate a text representing the slice of items displayed including the total number of items
  // .e.g. "Showing 11-20 of 100 items"
  const itemRangeText = getItemRangeText({
    pageIndex: currentPage,
    pageSize: paginationPageSize,
    max: totalCount,
  })

  const numberOfColumns = table.getAllColumns().length
  const gridTemplateColumns = `repeat(${numberOfColumns.toString()}, minmax(max-content, 1fr))`
  const gridTemplateColumnsExpandable =
    numberOfColumns <= 1
      ? numberOfColumns === 1
        ? '32px'
        : ''
      : `32px repeat(${numberOfColumns - 1}, minmax(max-content, 1fr))`

  const hasTitleOrSubtitle = title || subtitle

  // Only show pagination if there are more rows than the current page size
  const showPagination = totalCount > paginationPageSize

  return (
    <Fragment>
      <TableContainer hasPagination>
        {hasTitleOrSubtitle ? (
          <div className='r-table__masthead'>
            {title && <TableTitle id={tableTitleId}>{title}</TableTitle>}
            {subtitle && <TableSubtitle id={tableSubtitleId}>{subtitle}</TableSubtitle>}
          </div>
        ) : null}

        <Table
          cellPadding={cellPadding}
          gridTemplateColumns={expandable ? gridTemplateColumnsExpandable : gridTemplateColumns}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const child = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())

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
              <Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && props.renderExpandedRow?.(row)}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showPagination && (
        <Pagination
          pageSize={paginationPageSize}
          pageSizes={pageSizes}
          onPageSizeChange={handleOnPageSizeChange}
          itemRangeText={itemRangeText}
          backwardsDisabled={!table.getCanPreviousPage()}
          forwardsDisabled={!table.getCanNextPage()}
          onBackwards={handleOnPaginationBackwards}
          onForwards={handleOnPaginationForwards}
        />
      )}
    </Fragment>
  )
}
