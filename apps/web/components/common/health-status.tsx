import { Health } from '@ror/js-api-client'
import { IconIndicator } from '@ror/react/components/icon-indicator'
import type { IconIndicatorProps } from '@ror/react/components/icon-indicator'

interface HealthStatusProps {
  status: Health
  className?: string
  size?: IconIndicatorProps['size']
}

export function HealthStatus({ status, size, className }: HealthStatusProps) {
  switch (status) {
    case Health.Healthy:
      return <IconIndicator kind='normal' label='Operational' size={size} className={className} />
    case Health.Unhealthy:
      return <IconIndicator kind='caution-minor' label='Unhealthy' size={size} className={className} />
    case Health.Bad:
      return <IconIndicator kind='caution-major' label='Smelly' size={size} className={className} />
    case Health.Unknown:
    default:
      return <IconIndicator kind='unknown' label='Unknown status' size={size} className={className} />
  }
}
