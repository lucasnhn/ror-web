import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import { AriaAttributes, HTMLAttributes } from 'react'

export type TagVariant = 'readonly' | 'dismissible' | 'operational' | 'selectable'
export type SizeVariant = 'small' | 'medium' | 'large'

// TODO: Finish tag component

export interface TagProps extends HTMLAttributes<HTMLElement> {
  /**
   * Specify the label for the breadcrumb container
   */
  'aria-label'?: AriaAttributes['aria-label']

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string

  /**
   * How large should the tag be?
   * @default medium
   */
  size?: SizeVariant

  /**
   * What style of the tag should be used?
   * @default readonly
   */
  variant?: TagVariant

  /**
   * Merge props onto its immediate child.
   * @docs {@link https://www.radix-ui.com/primitives/docs/utilities/slot}
   */
  asChild?: boolean
}

export function Tag({
  size = 'medium',
  variant = 'readonly',
  className,
  children,
  asChild = false,
  ...rest
}: TagProps) {
  const classes = clsx(
    `r-tag r-tag--${size}`,
    {
      /**
       * The readonly variant is the default and doesn't need a modifier class.
       */
      [`r-tag--${variant}`]: variant !== 'readonly',
    },
    className
  )
  const Comp = asChild ? Slot : 'span'
  return (
    <div className='text-red-500'>
      <Comp className={classes} {...rest}>
        {children}
      </Comp>
    </div>
  )
}
