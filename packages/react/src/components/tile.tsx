import { clsx } from 'clsx'
import type { ReactElement, ReactNode } from 'react'

export interface TileProps {
  /**
   * Render the component by your element of choice
   * @example
   * <Tile as="footer">
   */
  as?: ReactElement['type']
  /**
   * Additional classes
   */
  className?: string
  /**
   * Content of the tile
   */
  children: ReactNode
}

export function Tile({ className, children, as = 'div' }: TileProps): ReactNode {
  const classes = clsx('r-tile', className)
  const Element = as
  return <Element className={classes}>{children}</Element>
}
