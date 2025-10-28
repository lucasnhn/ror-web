'use client'
import { Copy } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import { Button, ButtonSize } from '@ror/react'

export interface CopyButtonProps {
  /**
   * Specify the string that displays when hovering over the button
   */
  tooltip?: string

  /**
   * Specify the string that is displayed when the button is clicked and the content is copied
   */
  feedback?: string

  /**
   * Specify the time it takes for the feedback message to timeout
   */
  feedbackTimeout?: number

  /**
   * Specify a callback function that is called when the button is clicked
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void

  /**
   * How large should the copy button be?
   * @default 'md'
   */
  size?: ButtonSize

  /**
   * Specify an optional className to be applied to the button
   */
  className?: string

  /**
   * You can specify a child to be rendered inside the button as a replacement for the default copy icon
   */
  children?: ReactNode
}
export function CopyButton({ onClick, className, children, size = 'md' }: CopyButtonProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up timeout on unmount
  useEffect(() => {
    const timeout = timeoutRef.current
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
    toast.info('Copied to clipboard')
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    e.preventDefault()
    onClick?.(e)
  }

  const classes = clsx('r-copy-btn', 'no-drag', className)

  return (
    <Button icon={<Copy />} data-copy-button iconOnly onClick={handleOnClick} className={classes} size={size}>
      {children}
    </Button>
  )
}
