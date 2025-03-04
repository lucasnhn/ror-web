import { z } from 'zod'

export enum Health {
  Unknown = 0,
  Healthy = 1,
  Unhealthy = 2,
  Bad = 3,
}

export const HealthSchema = z.nativeEnum(Health)
