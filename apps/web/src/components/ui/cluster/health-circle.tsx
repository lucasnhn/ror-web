import { cn } from '@/utils/clsxm'
import { CircleCheck, TriangleAlert, Skull, CircleHelp } from 'lucide-react'

const getHealthColors = (status: string) => {
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
  healthCondition:
    | {
        message?: string | null | undefined
        type?: string | null | undefined
        status?: string | null | undefined
        lastTransitionTime?: string | null | undefined
        reason?: string | null | undefined
      }
    | undefined
}

export const HealthCircle = ({ className, healthCondition }: HealthCircleProps) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-full border-[4px] border-neutral-100',
      'w-10 h-10', // outer size
      className
    )}
  >
    <div
      className={cn(
        'flex items-center justify-center rounded-full w-full h-full',
        ...(getHealthColors(healthCondition?.status ?? 'unknown') || ['bg-gray-500', 'dark:bg-gray-600'])
      )}
    >
      {getHealthSymbol(healthCondition?.status ?? 'unknown')}
    </div>
  </div>
)
