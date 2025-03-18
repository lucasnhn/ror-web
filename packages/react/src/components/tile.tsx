import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

export interface TileProps {
  /**
   * Merge props onto its immediate child.
   * Useful for rendering for instance a Link instead of a button.
   * @docs {@link https://www.radix-ui.com/primitives/docs/utilities/slot}
   */
  asChild?: boolean

  /**
   * Specify the kind of tile
   */
  kind?: 'normal' | 'clickable'

  /**
   * Additional classes
   */
  className?: string
  /**
   * Content of the tile
   */
  children: ReactNode
}

export function Tile({ className, children, asChild = false, kind = 'normal' }: TileProps): ReactNode {
  const classes = clsx('r-tile', { 'r-tile--clickable': kind === 'clickable' }, className)
  const Comp = asChild ? Slot : 'div'
  return <Comp className={classes}>{children}</Comp>
}
