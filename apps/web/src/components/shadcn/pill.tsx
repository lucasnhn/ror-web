import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/clsxm'

const pillVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        red: 'border-transparent bg-red-500 text-primary-background',
        orange: 'border-transparent bg-orange-500 text-primary-background',
        amber: 'border-transparent bg-amber-500 text-primary-background',
        yellow: 'border-transparent bg-yellow-500 text-primary-background',
        lime: 'border-transparent bg-lime-500 text-primary-background',
        green: 'border-transparent bg-green-500 text-primary-background',
        emerald: 'border-transparent bg-emerald-500 text-primary-background',
        teal: 'border-transparent bg-teal-500 text-primary-background',
        cyan: 'border-transparent bg-cyan-500 text-primary-background',
        sky: 'border-transparent bg-sky-500 text-primary-background',
        blue: 'border-transparent bg-blue-500 text-primary-background',
        indigo: 'border-transparent bg-indigo-500 text-primary-background',
        violet: 'border-transparent bg-violet-500 text-primary-background',
        purple: 'border-transparent bg-purple-500 text-primary-background',
        fuchsia: 'border-transparent bg-fuchsia-500 text-primary-background',
        pink: 'border-transparent bg-pink-500 text-primary-background',
        rose: 'border-transparent bg-rose-500 text-primary-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Pill({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof pillVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return <Comp data-slot='pill' className={cn(pillVariants({ variant }), className, 'rounded-full')} {...props} />
}

export { Pill, pillVariants }
