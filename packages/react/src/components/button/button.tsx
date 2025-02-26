import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { BaseButton } from './button-base'
import { ButtonWithIconOnlyProps, IconOnlyButton } from './button-icon-only'
import { ButtonSize, ButtonVariant } from './constants'

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * How large should the button be?
   * @default 'md'
   */
  size?: ButtonSize

  /**
   * What style of the button should be used?
   * @default 'primary'
   */
  variant?: ButtonVariant

  /**
   * Any additional classNames for customization
   */
  className?: string

  /**
   * The icon to be displayed inside the button.
   */
  icon?: ReactElement

  /**
   * Specify if the button is an icon-only button
   */
  iconOnly?: boolean

  /**
   * Specify whether the Button should be disabled, or not
   */
  disabled?: boolean

  /**
   * Merge props onto its immediate child.
   * Useful for rendering for instance a Link instead of a button.
   * @docs {@link https://www.radix-ui.com/primitives/docs/utilities/slot}
   */
  asChild?: boolean

  /**
   * The content of the button to render
   */
  children?: ReactNode
}

function isButtonIconOnly(props: ButtonProps): props is ButtonWithIconOnlyProps {
  return 'iconOnly' in props && props.iconOnly === true
}

export function Button(props: ButtonProps) {
  // Make sure label is provided when iconOnly is true
  if (isButtonIconOnly(props)) {
    return <IconOnlyButton {...props} />
  }

  return <BaseButton {...props} />
}
