import { IconIndicator } from '@ror/react/components/icon-indicator'
import type { IconIndicatorProps } from '@ror/react/components/icon-indicator'

/**
 * Props for the HealthStatus component.
 *
 * @property status - Numeric value representing the health status.
 * @property className - Optional CSS class name(s) to apply to the component.
 * @property size - Optional size for the icon indicator, inherited from IconIndicatorProps.
 */
interface HealthStatusProps {
  status: number
  className?: string
  size?: IconIndicatorProps['size']
}

/**
 * Renders a health status indicator based on the provided status code.
 *
 * @param status - The health status code:
 *   - `1`: Operational
 *   - `2`: Unhealthy
 *   - `3`: Smelly
 *   - `0` or any other value: Unknown status
 * @param size - The size of the indicator icon.
 * @param className - Optional CSS class for custom styling.
 * @returns A React element displaying the corresponding health status indicator.
 */
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
