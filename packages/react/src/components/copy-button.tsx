'use client'
import { Copy } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Button, ButtonSize } from './button'
import { toast, Toaster } from 'sonner'

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Determine theme on the client side
  useEffect(() => {
    const getTheme = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light'
      }
      return 'system'
    }

    setTheme(getTheme())
  }, [])

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toast.info('Copied to clipboard')
    e.stopPropagation()
    onClick?.(e)
  }

  const classes = clsx('r-copy-btn', className)

  return (
    <>
      <Button icon={<Copy />} iconOnly onClick={handleOnClick} className={classes} size={size}>
        {children}
      </Button>
    </>
  )
}
