import { cn } from '@/utils/clsxm'
import { CircleCheck, TriangleAlert, Skull, CircleHelp } from 'lucide-react'

const healthColors = [
  ['bg-cyan-500', 'dark:bg-cyan-600'],
  ['bg-orange-500', 'dark:bg-orange-600'],
  ['bg-[#EF4444]', 'dark:bg-[#ED2828]'],
]

// health is number from 1 to 3
const getHealthSymbol = (health: number) => {
  const icons = [CircleCheck, TriangleAlert, Skull]
  const Icon = icons[health - 1] || CircleHelp
  return <Icon className='text-neutral-100 w-8 h-8' />
}

interface HealthCircleProps {
  className?: string
  health: number
}

export const HealthCircle = ({ className, health }: HealthCircleProps) => (
  <div className={cn(className, 'bg-neutral-100 p-0.5 rounded-full relative flex items-center justify-center')}>
    <div
      className={`w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full flex items-center justify-center ${healthColors[health - 1][0]} ${healthColors[health - 1][1]}`}
    >
      {getHealthSymbol(health)}
    </div>
  </div>
)
