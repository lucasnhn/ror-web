import { cn } from '@/utils/clsxm'
import { CircleCheck, TriangleAlert, Skull, CircleHelp } from 'lucide-react'

const getHealthColors = (status: string) => {
  console.log('getHealthColors', status)
  switch (status) {
    case 'ok':
      return ['bg-cyan-500', 'dark:bg-cyan-600']
    case 'working':
      return ['bg-cyan-500', 'dark:bg-cyan-600']
    case 'warning':
      return ['bg-orange-500', 'dark:bg-orange-600']
    case 'error':
      return ['bg-[#EF4444]', 'dark:bg-[#ED2828]']
    case 'unknown':
      return ['bg-gray-500', 'dark:bg-gray-600']
    default:
      return ['bg-gray-500', 'dark:bg-gray-600']
  }
}

// health is number from 1 to 3
const getHealthSymbol = (status: string) => {
  switch (status) {
    case 'ok':
      return <CircleCheck />
    case 'working':
      return <CircleCheck />
    case 'warning':
      return <TriangleAlert />
    case 'error':
      return <Skull />
    case 'unknown':
      return <CircleHelp />
    default:
      return <CircleHelp />
  }
}

interface HealthCircleProps {
  className?: string
  health:
    | {
        type: string
        status: string
        lastTransitionTime: string
        reason: string
        message: string
      }
    | undefined
}

export const HealthCircle = ({ className, health }: HealthCircleProps) => (
  <div className={cn(className, 'bg-neutral-100 p-0.5 rounded-full relative flex items-center justify-center')}>
    <div
      className={`w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full flex items-center justify-center ${(getHealthColors(health?.status ?? 'unknown') || ['bg-gray-500', 'dark:bg-gray-600'])[0]} ${(getHealthColors(health?.status ?? 'unknown') || ['bg-gray-500', 'dark:bg-gray-600'])[1]}`}
    >
      {health ? getHealthSymbol(health.status) : getHealthSymbol('unknown')}
    </div>
  </div>
)
