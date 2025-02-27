import type { ReactElement, ReactNode } from 'react'
import { clsx } from 'clsx'
import { BaseButton } from './button-base'
import type { BaseButtonProps } from './button-base'

export interface ButtonWithIconOnlyProps extends Omit<BaseButtonProps, 'children'> {
  /**
   * The icon to be displayed inside the button.
   */
  icon: ReactElement

  /**
   * Render a child element instead of the icon, useful if you want to use text instead of an icon.
   */
  children?: ReactNode
}

/**
 * Renders an icon-only button with a tooltip.
 *
 * @remarks
 * If a child is provided, it will be rendered inside the button as a replacement for the icon property
 *
 * @private
 */
export function IconOnlyButton({
  size = 'md',
  variant = 'primary',
  icon,
  className,
  disabled,
  children,
  ...rest
}: ButtonWithIconOnlyProps) {
  const buttonIconClasses = clsx('r-btn--icon-only', className)

  return (
    <BaseButton aria-label='' size={size} variant={variant} disabled={disabled} className={buttonIconClasses} {...rest}>
      {children ?? icon}
    </BaseButton>
  )
}
