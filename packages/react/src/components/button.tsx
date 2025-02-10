import clsx from 'clsx'
import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * What style of the button should be used?
   * @default primary
   */
  variant?: ButtonVariant

  /**
   * Any additional classNames for customization
   */
  className?: string

  /**
   * Merge props onto its immediate child.
   * Useful for rendering for instance a Link instead of a button.
   * @docs {@link https://www.radix-ui.com/primitives/docs/utilities/slot}
   */
  asChild?: boolean
}

export function Button({
  size = 'medium',
  variant = 'primary',
  className,
  children,
  asChild = false,
  ...rest
}: ButtonProps) {
  const classes = clsx(
    `r-btn r-btn--${size}`,
    {
      /**
       * The primary variant is the default and doesn't need a modifier class.
       */
      [`r-btn--${variant}`]: variant !== 'primary',
    },
    className
  )
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={classes} {...rest}>
      {children}
    </Comp>
  )
}
