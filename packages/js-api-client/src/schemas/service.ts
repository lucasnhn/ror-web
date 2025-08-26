import { z } from 'zod'
import { V2ResourceSchema, createV2ResourceResponseSchema } from './common'

const ServicePortsSchema = z.object({
  appProtocol: z.string(),
  name: z.string(),
  prot: z.number(),
  protocol: z.string(),
  targetPort: z.union([z.number(), z.string()]),
})

const ServiceSpecSchema = z.object({
  type: z.string(),
  selector: z.record(z.string(), z.string()),
  ports: z.array(ServicePortsSchema),
  clusterIp: z.string(),
  clusterIPs: z.array(z.string()),
  externalIPs: z.array(z.string()).optional(),
  externalName: z.string().optional(),
  ipFamilies: z.array(z.string()),
  ipFamilyPolicy: z.string(),
  internalTrafficPolicy: z.string(),
  externalTrafficPolicy: z.string(),
})

export const ServiceSchema = V2ResourceSchema.extend({
  node: z.object({
    spec: ServiceSpecSchema,
  }),
})

export const ServiceResponseSchema = createV2ResourceResponseSchema(ServiceSchema)
