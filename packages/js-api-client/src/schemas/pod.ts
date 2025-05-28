import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

const PodSpecContainersPorts = z.object({
  name: z.string().optional(),
  containerPort: z.number().optional(),
  protocol: z.string().optional(),
})

const PodSpecContainers = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  ports: z.array(PodSpecContainersPorts).optional(),
})

const PodSpecSchema = z.object({
  containers: z.array(PodSpecContainers).optional(),
  ServiceAccountName: z.string().optional(),
  NodeName: z.string().optional(),
})

const PodStatusSchema = z.object({
  Message: z.string().optional(),
  Phase: z.string().optional(),
  Reason: z.string().optional(),
  StartTime: z.string().optional(),
})

export const PodSchema = V2ResourceSchema.extend({
  pod: z.object({
    spec: PodSpecSchema,
    status: PodStatusSchema,
  }),
})

export const PodResponseSchema = createV2ResourceResponseSchema(PodSchema)
