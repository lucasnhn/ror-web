'use client'
import { clsx } from 'clsx'
import { useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { ContentSwitchContext } from './context'

export interface ContentSwitchProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /**
   * Pass in Switch components to be rendered in the ContentSwitcher
   */
  children?: ReactNode[]

  /**
   * Specify an optional className to be added to the container node
   */
  className?: string

  /**
   * Specify an `onChange` handler that is called whenever the ContentSwitcher
   * changes which item is selected
   */
  onChange?: (name: string) => void

  /**
   * Specify the size of the Content Switcher. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Specify the selected tab/switch to display per default, should be the name of one of the switches
   */
  defaultSelected?: string
}

export function ContentSwitch({
  className,
  children,
  onChange,
  size = 'md',
  defaultSelected = '',
  ...rest
}: ContentSwitchProps) {
  const [selected, setSelected] = useState(defaultSelected)

  function handleOnChange(key: string) {
    setSelected(key)
    if (typeof onChange === 'function') {
      onChange(key)
    }
  }

  const classes = clsx('r-content-switch', {
    [`r-content-switch--${size}`]: size,
  })

  const contextValue = {
    selected,
    setSelected: handleOnChange,
  }

  return (
    <div {...rest} className={classes} role='tablist'>
      <ContentSwitchContext.Provider value={contextValue}>{children}</ContentSwitchContext.Provider>
    </div>
  )
}
