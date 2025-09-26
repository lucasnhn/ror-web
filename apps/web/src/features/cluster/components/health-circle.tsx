import { cn } from '@/utils/clsxm'
import { CircleCheck, TriangleAlert, Skull, CircleHelp } from 'lucide-react'
import { HealthStatus } from '../types/health-status'

const healthVisuals: Record<HealthStatus, { icon: JSX.Element; colors: string[] }> = {
  ok: {
    icon: <CircleCheck />,
    colors: ['bg-cyan-500', 'dark:bg-cyan-600'],
  },
  working: {
    icon: <CircleCheck />,
    colors: ['bg-cyan-500', 'dark:bg-cyan-600'],
  },
  warning: {
    icon: <TriangleAlert />,
    colors: ['bg-orange-500', 'dark:bg-orange-600'],
  },
  error: {
    icon: <Skull />,
    colors: ['bg-[#EF4444]', 'dark:bg-[#ED2828]'],
  },
  unknown: {
    icon: <CircleHelp />,
    colors: ['bg-gray-500', 'dark:bg-gray-600'],
  },
}

interface HealthCircleProps {
  className?: string
  healthCondition:
    | {
        message?: string | null | undefined
        type?: string | null | undefined
        status?: HealthStatus | null | undefined
        lastTransitionTime?: string | null | undefined
        reason?: string | null | undefined
      }
    | undefined
}

export const HealthCircle = ({ className, healthCondition }: HealthCircleProps) => {
  const status = healthCondition?.status ?? 'unknown'
  const { colors, icon } = healthVisuals[status] ?? healthVisuals.unknown

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-[4px] border-neutral-100',
        'w-10 h-10',
        className
      )}
    >
      <div className={cn('flex items-center justify-center rounded-full w-full h-full', ...colors)}>{icon}</div>
    </div>
  )
}
