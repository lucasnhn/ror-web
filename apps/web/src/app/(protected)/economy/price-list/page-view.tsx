'use client'

import { Price } from '@/types/prices'

interface PageViewProps {
  className?: string
  simplePrices?: Price[]
}

export const PageView = ({ className, simplePrices }: PageViewProps) => {
  return (
    <div className={className}>
      <ul>
        {simplePrices?.map((price) => (
          <li key={price.id}>
            {price.machineClass}: ${price.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}
