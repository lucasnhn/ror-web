import { IconIndicator } from '@ror/react/components/icon-indicator'
import type { IconIndicatorProps } from '@ror/react/components/icon-indicator'

interface HealthStatusProps {
  status: number
  className?: string
  size?: IconIndicatorProps['size']
}

export function HealthStatus({ status, size, className }: HealthStatusProps) {
  switch (status) {
    case 1:
      return <IconIndicator kind='normal' label='Operational' size={size} className={className} />
    case 2:
      return <IconIndicator kind='caution-minor' label='Unhealthy' size={size} className={className} />
    case 3:
      return <IconIndicator kind='caution-major' label='Smelly' size={size} className={className} />
    case 0:
    default:
      return <IconIndicator kind='unknown' label='Unknown status' size={size} className={className} />
  }
}
