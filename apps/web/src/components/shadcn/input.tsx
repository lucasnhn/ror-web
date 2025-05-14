import * as React from 'react'
import { cn } from '@/utils/clsxm'

type InputProps = React.ComponentProps<'input'> & {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

function Input({ className, type, icon, iconPosition = 'left', ...props }: InputProps) {
  const paddingClass = icon ? (iconPosition === 'left' ? 'pl-9 pr-3' : 'pl-3 pr-9') : 'px-3'

  return (
    <div className='relative'>
      {icon && (
        <span
          className={cn(
            'absolute inset-y-0 flex items-center text-muted-foreground pointer-events-none',
            iconPosition === 'left' ? 'left-2' : 'right-2'
          )}
        >
          {icon}
        </span>
      )}
      <input
        type={type}
        data-slot='input'
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-52 min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          paddingClass,
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
