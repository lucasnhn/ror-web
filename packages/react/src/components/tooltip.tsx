'use client'
import {
  TooltipArrow,
  TooltipContent,
  TooltipContentProps,
  Tooltip as TooltipPrimitive,
  TooltipTrigger,
  type TooltipProps as TooltipPrimitiveProps,
} from '@radix-ui/react-tooltip'
export { TooltipProvider } from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

export interface TooltipProps extends TooltipPrimitiveProps, Omit<TooltipContentProps, 'content'> {
  /**
   * The trigger element for the tooltip.
   */
  children: ReactNode
  /**
   * The content to display in the tooltip.
   */
  content: ReactNode
}

export function Tooltip({ children, content, defaultOpen, open, onOpenChange, ...rest }: TooltipProps) {
  return (
    <TooltipPrimitive defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...rest} className='r-tooltip'>
        <div className='r-tooltip__inner'>{content}</div>
        <TooltipArrow width={8} height={5} className='r-tooltip__arrow' />
      </TooltipContent>
    </TooltipPrimitive>
  )
}
