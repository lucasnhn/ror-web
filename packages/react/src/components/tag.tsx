"use client"

import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import type { AriaAttributes, HTMLAttributes, ReactNode } from 'react'
import { useState } from 'react'

export type TagVariant = 'readonly' | 'dismissible' | 'operational' | 'selectable'
export type SizeVariant = 'sm' | 'md' | 'lg'
export type TagSeverity = 'error' | 'success' | 'warning' | 'info' | 'caution-minor' | 'caution-major' | 'caution-undefined'
export type TagColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'gray' | 'neutral'

// TODO: Implement operational tag

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
   * @default md
   */
  size?: SizeVariant

  /**
   * What style of the tag should be used?
   * @default readonly
   */
  variant?: TagVariant

  /**
   * What should the tag color be? 
   */
  color?: TagColor

  /**
   * What icon should be used?
   * @default null
   */
  icon?: ReactNode

  /**
   * Merge props onto its immediate child.
   * @docs {@link https://www.radix-ui.com/primitives/docs/utilities/slot}
   */
  asChild?: boolean
}

export function Tag({
  size = 'md',
  variant = 'readonly',
  icon = null,
  className,
  color = 'neutral',
  children,
  asChild = false,
  ...rest
}: TagProps) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const hasIcon = icon !== null
  const classes = clsx(
    `r-tag r-tag--${size} r-tag--${color}`,
    {
      /**
       * The readonly variant is the default and doesn't need a modifier class.
       */
      [`r-tag--${variant}`]: variant !== 'readonly',
      'r-tag--has-icon': hasIcon,
      'r-tag--inactive': variant === 'selectable' && !isActive,
    },
    className,
  )
  const Comp = asChild ? Slot : 'span'

  const handleClick = () => {
    setIsActive((prev) => !prev);
  }
 
  return (
    <div onClick={handleClick}>
      <Comp className={classes} {...rest}>
      {hasIcon && <span className='r-tag--icon-container'>{icon}</span>}
        {children}
        {variant === 'dismissible' && (
          <XIcon className='r-tag__remove-icon' />
        )}
      </Comp>
    </div>
  )
}
