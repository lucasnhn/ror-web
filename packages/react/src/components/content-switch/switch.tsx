import clsx from 'clsx'
import { useContext } from 'react'
import type { ReactNode, MouseEvent, KeyboardEvent, ComponentPropsWithoutRef } from 'react'
import { ContentSwitchContext } from './context'
import { Enter, matches } from '../../utils/keyboard'

export interface SwitchProps extends Omit<ComponentPropsWithoutRef<'button'>, 'name' | 'onClick' | 'onKeyDown'> {
  /**
   * Provide child elements to be rendered inside of the Switch
   */
  children?: ReactNode

  /**
   * Specify an optional className to be added to your Switch
   */
  className?: string

  /**
   * Specify whether or not the Switch should be disabled
   */
  disabled?: boolean

  /**
   * Provide the name of your Switch that is used for event handlers
   */
  name: string
}

export function Switch({ children, className, disabled, name, ...rest }: SwitchProps) {
  const context = useContext(ContentSwitchContext)

  const { selected, setSelected } = context

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setSelected(name)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (matches(event, [Enter])) {
      event.preventDefault()
      setSelected(name)
    }
  }

  const classes = clsx(
    'r-content-switch__tab',
    {
      'r-content-switch__tab--selected': selected === name,
    },
    className
  )

  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    className: classes,
    disabled,
  }

  return (
    <button
      type='button'
      role='tab'
      tabIndex={selected === name ? 0 : -1}
      aria-selected={selected === name}
      {...rest}
      {...commonProps}
    >
      <span className='r-content-switch__tab-label'>{children}</span>
    </button>
  )
}
