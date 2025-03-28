'use client'

import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import type { AriaAttributes, ReactNode } from 'react'
import type { PolymorphicComponentPropWithRef } from '../types/polymorphic'

export type TagVariant = 'readonly' | 'dismissible' | 'operational' | 'selectable'
export type SizeVariant = 'sm' | 'md' | 'lg'
export type TagColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'gray' | 'neutral'

// TODO: Implement operational tag

export interface TagBaseProps {
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
   * Specify if the component is selected
   * (only applicable to variant = 'selectable')
   */
  isSelected?: boolean
}

export type TagProps<T extends React.ElementType> = PolymorphicComponentPropWithRef<T, TagBaseProps>

export function Tag<T extends React.ElementType>({
  size = 'md',
  variant = 'readonly',
  icon = null,
  className,
  color = 'neutral',
  children,
  isSelected = false,
  onClick,
  as: BaseComponent,
  ...rest
}: TagProps<T>) {
  const hasIcon = icon !== null
  const classes = clsx(
    `r-tag r-tag--${size} r-tag--${color}`,
    {
      /**
       * The readonly variant is the default and doesn't need a modifier class.
       */
      [`r-tag--${variant}`]: variant !== 'readonly',
      'r-tag--has-icon': hasIcon,
      'r-tag--selected': variant === 'selectable' && isSelected,
    },
    className
  )

  const ComponentTag = BaseComponent ?? 'div'

  return (
    <ComponentTag className={classes} title={typeof children === 'string' ? children : undefined} {...rest}>
      {hasIcon && <span className='r-tag__icon-container'>{icon}</span>}
      <span className='r-tag__label'>{children}</span>
      {variant === 'dismissible' && <XIcon className='r-tag__remove-icon' />}
    </ComponentTag>
  )
}
