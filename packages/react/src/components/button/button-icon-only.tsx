import type { ReactElement } from 'react'
import { clsx } from 'clsx'
import { BaseButton } from './button-base'
import type { BaseButtonProps } from './button-base'

export interface ButtonWithIconOnlyProps extends Omit<BaseButtonProps, 'children'> {
  /**
   * The icon to be displayed inside the button.
   */
  icon: ReactElement
}

/**
 * Renders an icon-only button with a tooltip.
 * @private
 */
export function IconOnlyButton({
  size = 'md',
  variant = 'primary',
  icon,
  className,
  disabled,
  ...rest
}: ButtonWithIconOnlyProps) {
  const buttonIconClasses = clsx('r-btn--icon-only', className)

  return (
    <BaseButton aria-label='' size={size} variant={variant} disabled={disabled} className={buttonIconClasses} {...rest}>
      {icon}
    </BaseButton>
  )
}
