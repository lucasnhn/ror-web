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
  TableSortHeader,
  TableHeader,
  TableToolbar,
  TableToolbarSearch,
} from '@ror/react/components/table'
import type { TableProps } from '@ror/react/components/table'
import { Pagination } from '@ror/react/components/pagination'
import { SortDirection } from '@ror/react/utils/sorting'
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef, Header, PaginationState, Row, SortingState } from '@tanstack/react-table'
import { getItemRangeText } from './pagination'
import { ChangeEvent, ChangeEventHandler, Fragment, useId } from 'react'
import { Layer } from '@ror/react'

/**
 * DataTableColumnDef is a type that represents a column definition for a DataTable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumnDef<TData> = ColumnDef<TData, any>

export type DataTablePagination = PaginationState
export type DataTableSorting = SortingState

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

  sorting?: SortingState
  onSortingChange?: (state: SortingState) => void

  /**
   * The current search query
   */
  searchQuery?: string
  /**
   * Callback for when the user changes the search query
   */
  onSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void

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
    sorting = [],
    onSortingChange,
    searchQuery,
    onSearchChange,
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
     * This assumes that the data is already sorted and paginated.
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

    enableSorting: true,
    onSortingChange: (updater) => {
      if (props.sorting && typeof onSortingChange === 'function') {
        const newState = updater instanceof Function ? updater(props.sorting) : updater
        onSortingChange(newState)
      }
    },

    /**
     * The controlled pagination state
     */
    state: {
      pagination,
      sorting,
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

  const handleOnSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (typeof onSearchChange === 'function') {
      onSearchChange(event)
    }
  }

  const getSortingOrder = <TData, TValue>(header: Header<TData, TValue>): SortDirection => {
    const direction = header.column.getIsSorted()

    if (direction === 'asc') {
      return SortDirection.ASC
    } else if (direction === 'desc') {
      return SortDirection.DESC
    }

    return SortDirection.NONE
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
  const gridTemplateColumnsExpandable = `32px repeat(${numberOfColumns - 1}, minmax(max-content, 1fr))`

  const hasTitleOrSubtitle = title || subtitle

  return (
    <Fragment>
      <TableContainer hasPagination>
        {hasTitleOrSubtitle ? (
          <div className='r-table__masthead'>
            {title && <TableTitle id={tableTitleId}>{title}</TableTitle>}
            {subtitle && <TableSubtitle id={tableSubtitleId}>{subtitle}</TableSubtitle>}
          </div>
        ) : null}

        <TableToolbar>
          <Layer level={1}>
            {typeof onSearchChange === 'function' && (
              <TableToolbarSearch labelText='Search' value={searchQuery} onChange={handleOnSearchChange} />
            )}
          </Layer>
        </TableToolbar>
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
              <Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
                {/* {row.getIsExpanded() && (
                  <TableRow className=''>
                    <TableCell
                      style={{ gridColumn: `span ${table.getAllFlatColumns().length}` }}
                      className='bg-[var(--r-layer)] brightness-102 dark:brightness-130'
                    >
                      {(row.original as Nodepool).nodes.map((node) => <NodeCard key={node.name} node={node} />)} */}
                {/* Replace with your expanded content */}
                {/* <div className="w-full bg-muted p-2 rounded">
                        Expanded content here...
                      </div>*/}
                {/* </TableCell>  */}
                {/* <td colSpan={7} className='bg-red-400'>
                        <span className='bg-blue-400'>Test</span>
                    </td> */}
                {/* </TableRow> */}
                {/* )} */}
                {row.getIsExpanded() && props.renderExpandedRow?.(row)}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Fragment>
  )
}
