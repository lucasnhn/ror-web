import { clsx } from 'clsx'
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent, PropsWithChildren, ReactElement } from 'react'
import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import type { SortDirection as SortDirectionType } from '../../utils/sorting'
import { SortDirection, transition } from '../../utils/sorting'
import { Button } from '../button'

/**
 * Reoccuring types
 */
type CellAlignment = 'start' | 'end' | undefined

/**
 * Table
 */
export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  /**
   * Provide an id to an element which uniquely describes this table
   */
  'aria-describedby'?: string

  /**
   * Provide an id to an element which uniquely labels this table
   */
  'aria-labelledby'?: string

  /**
   * Column width definitions
   */
  gridTemplateColumns: CSSProperties['gridTemplateColumns']

  /**
   * Specify the amount of space that should be available around the contents of
   * a cell
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious'
}

export function Table({
  'aria-labelledby': labelledby,
  cellPadding = 'normal',
  className,
  gridTemplateColumns,
  children,
  ...rest
}: TableProps) {
  const classes = clsx(
    'r-table',
    {
      'r-table--condensed': cellPadding === 'condensed',
      'r-table--normal': cellPadding === 'normal',
      'r-table--spacious': cellPadding === 'spacious',
    },
    className
  )
  const style = { '--grid-template-columns': gridTemplateColumns } as CSSProperties

  return (
    <div className='r-table-overflow' aria-labelledby={labelledby}>
      <table
        aria-labelledby={labelledby}
        className={classes}
        data-cell-padding={cellPadding}
        style={style}
        role='table'
        {...rest}
      >
        {children}
      </table>
    </div>
  )
}

/**
 * Table Head
 */
export type TableHeadProps = ComponentPropsWithoutRef<'thead'>
export function TableHead({ children, className, ...rest }: TableHeadProps) {
  const classes = clsx('r-table__head', className)
  return (
    // We need to explicitly pass this role because some ATs and browsers drop table semantics
    // when we use `display: contents` or `display: grid` in the table
    <thead {...rest} className={classes} role='rowgroup'>
      {children}
    </thead>
  )
}

/**
 * Table Body
 */
export type TableBodyProps = ComponentPropsWithoutRef<'tbody'>
export function TableBody({ children, className, ...rest }: TableBodyProps) {
  const classes = clsx('r-table__body', className)
  return (
    // We need to explicitly pass this role because some ATs and browsers drop table semantics
    // when we use `display: contents` or `display: grid` in the table
    <tbody {...rest} className={classes} role='rowgroup'>
      {children}
    </tbody>
  )
}

export interface TableHeaderProps extends Omit<ComponentPropsWithoutRef<'th'>, 'align'> {
  /**
   * The horizontal alignment of the cell's content
   */
  align?: CellAlignment
}

export function TableHeader({ align, className, children, ...rest }: TableHeaderProps) {
  const classes = clsx(
    'r-table__header',
    {
      'r-table__header--start': align === 'start',
      'r-table__header--end': align === 'end',
    },
    className
  )
  return (
    <th {...rest} className={classes} role='columnheader' scope='col' data-cell-align={align}>
      {children}
    </th>
  )
}

interface TableSortHeaderProps extends TableHeaderProps {
  /**
   * Specify the unique identifier for this column header (sent back in the onToggleSort callback)
   */
  id: string

  /**
   * Specify the sort direction for the TableHeader
   */
  direction?: SortDirectionType

  /**
   * Provide a handler that is called when the sortable TableHeader is
   * interacted with via a click or keyboard interaction
   */
  onToggleSort: (id: string, nextDirection: SortDirectionType, event: MouseEvent<HTMLButtonElement>) => void
}

export function TableSortHeader({
  id,
  align,
  children,
  className,
  direction = SortDirection.NONE,
  onToggleSort,
  ...rest
}: TableSortHeaderProps) {
  const handleOnClick = (event: MouseEvent<HTMLButtonElement>) => {
    const nextDirection = transition(direction)
    onToggleSort(id, nextDirection, event)
  }

  const ariaSort =
    direction === SortDirection.DESC ? 'descending' : direction === SortDirection.ASC ? 'ascending' : undefined

  return (
    <TableHeader {...rest} aria-sort={ariaSort} align={align} className={className}>
      <Button type='button' className='r-table__sort-btn' onClick={handleOnClick}>
        {children}
        <TableSortIcon direction={direction} />
      </Button>
    </TableHeader>
  )
}

function TableSortIcon({ direction }: { direction: SortDirectionType }) {
  switch (direction) {
    case SortDirection.NONE:
      return <ArrowDownUp className='r-table__sort-icon r-table__sort-icon--none' />
    case SortDirection.ASC:
      return <ArrowUpNarrowWide className='r-table__sort-icon r-table__sort-icon--ascending' />
    case SortDirection.DESC:
      return <ArrowDownWideNarrow className='r-table__sort-icon r-table__sort-icon--descending' />
    default:
      return null
  }
}

/**
 * Table Row
 */
export type TableRowProps = ComponentPropsWithoutRef<'tr'>
export function TableRow({ children, className, ...rest }: TableRowProps) {
  const classes = clsx('r-table__row', className)
  return (
    <tr {...rest} className={classes} role='row'>
      {children}
    </tr>
  )
}

/**
 * Table Cell
 */
export interface TableCellProps extends Omit<ComponentPropsWithoutRef<'td'>, 'align'> {
  /**
   * The horizontal alignment of the cell's content
   */
  align?: CellAlignment

  /**
   * Provide the scope for a table cell, useful for defining a row header using
   * `scope="row"`
   */
  scope?: 'row'
}

export function TableCell({ align, className, children, scope, ...rest }: TableCellProps) {
  const Comp = scope ? 'th' : 'td'
  const role = scope ? 'rowheader' : 'cell'
  const classes = clsx(
    'r-table__cell',
    {
      'r-table__cell--start': align === 'start',
      'r-table__cell--end': align === 'end',
    },
    className
  )
  return (
    <Comp {...rest} className={classes} scope={scope} role={role} data-cell-align={align}>
      {children}
    </Comp>
  )
}

/**
 * Table Container
 */
export type TableContainerProps = ComponentPropsWithoutRef<'div'> & {
  hasPagination?: boolean
}
export function TableContainer({ className, children, hasPagination = false, ...rest }: TableContainerProps) {
  const classes = clsx('r-table-container', { 'r-table-container--with-pagination': hasPagination }, className)
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

/**
 * Table title
 */

export interface TableTitleProps {
  /**
   * Provide an alternate element or component to use as the container for
   * `TableSubtitle`. This is useful when specifying markup that is more
   * semantic for your use-case, such as a heading tag.
   */
  as?: ReactElement['type']

  /**
   * Provide a unique id for the table subtitle. This should be used along with
   * `aria-labelledby` on `DataTable`
   */
  id: string

  /**
   * Provide a className for the table subtitle
   */
  className?: string
}

export const TableTitle = forwardRef<HTMLElement, PropsWithChildren<TableTitleProps>>(function TableTitle(
  { as = 'h2', children, className, id, ...rest },
  ref
) {
  const Element = as
  const classes = clsx('r-table__title', className)
  return (
    <Element {...rest} className={classes} id={id} ref={ref}>
      {children}
    </Element>
  )
})

/**
 * Table subtitle
 */

export interface TableSubtitleProps {
  /**
   * Provide an alternate element or component to use as the container for
   * `TableSubtitle`. This is useful when specifying markup that is more
   * semantic for your use-case
   */
  as?: ReactElement['type']

  /**
   * Provide a unique id for the table subtitle. This should be used along with
   * `aria-describedby` on `DataTable`
   */
  id: string

  /**
   * Provide a className for the table subtitle
   */
  className?: string
}

export function TableSubtitle({ as = 'p', children, className, id, ...rest }: PropsWithChildren<TableSubtitleProps>) {
  const Element = as
  const classes = clsx('r-table__subtitle', className)
  return (
    <Element {...rest} className={classes} id={id}>
      {children}
    </Element>
  )
}

/**
 * Table actions
 */
export type TableActionsProps = ComponentPropsWithoutRef<'div'>
export function TableActions({ className, children, ...rest }: TableActionsProps) {
  const classes = clsx('r-table__actions', className)
  return (
    <div {...rest} className={classes}>
      {children}
    </div>
  )
}
