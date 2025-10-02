/*
 * FILE OVERVIEW
 *
 * A client-side numeric picker component that allows users to increment or decrement a numeric value.
 */

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/shadcn/button'

/**
 * A numeric picker component that allows users to increment or decrement a numeric value.
 *
 * @param title - The label displayed above the picker.
 * @param value - The current numeric value.
 * @param setValue - Callback function to update the value.
 * @param name - The name attribute for the hidden input, useful for form submissions.
 */
export const NumPicker = ({
  title,
  value,
  setValue,
  name,
}: {
  title: string
  value: number
  setValue: (v: number) => void
  name: string
}) => {
  const increment = () => setValue(value + 1)
  const decrement = () => setValue(Math.max(1, value - 1))
  return (
    <div>
      <h4>{title}</h4>
      <div className='flex flex-row items-center gap-1'>
        <Button type='button' onClick={decrement}>
          <Minus />
        </Button>
        <span className='w-20 bg-[var(--r-layer)] h-9 flex justify-center items-center border-1 rounded-[7px]'>
          {value}
        </span>
        <Button type='button' onClick={increment}>
          <Plus />
        </Button>
      </div>
      <input type='hidden' name={name} value={String(value)} />
    </div>
  )
}
