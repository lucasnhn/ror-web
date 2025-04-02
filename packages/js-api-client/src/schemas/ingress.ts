import { z } from 'zod'
import { createV2ResourceResponseSchema } from './common'

const IngressSpecBackendResource = z.object({
  apiGroup: z.string().nullable().optional(),
  kind: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
})

const IngressSpecBackendServicePort = z.object({
  name: z.string().nullable().optional(),
  number: z.number().nullable().optional(),
})

const IngressSpecBackendService = z.object({
  name: z.string().nullable().optional(),
  port: IngressSpecBackendServicePort.nullable().optional(),
})

const IngressSpecRulesHttpPathsBackendSchema = z.object({
  resource: IngressSpecBackendResource.nullable().optional(),
  service: IngressSpecBackendService.nullable().optional(),
})

const IngressSpecRulesHttpPathsSchema = z.object({
  backend: IngressSpecRulesHttpPathsBackendSchema,
  path: z.string(),
  pathType: z.string(),
})

const IngressSpecRulesHttpSchema = z.object({
  paths: IngressSpecRulesHttpPathsSchema.nullable().optional(),
})

const IngressSpecRulesSchema = z.object({
  apiGroup: z.string(),
  http: IngressSpecRulesHttpSchema,
})

const IngressSpecTlsSchema = z.object({
  hosts: z.array(z.string()),
  secretName: z.string(),
})

const IngressSpecSchema = z.object({
  defaultBackend: IngressSpecRulesHttpPathsBackendSchema.nullable().optional(),
  ingressClassName: z.string(),
  rules: z.array(IngressSpecRulesSchema),
  tls: z.array(IngressSpecTlsSchema),
})

const IngressStatusLoadBalancerIngressSchema = z.object({
  hostname: z.string(),
  ip: z.string(),
})

const IngressStatusLoadBalancerSchema = z.object({
  ingress: z.array(IngressStatusLoadBalancerIngressSchema),
})

const IngressStatusSchema = z.object({
  loadBalancer: IngressStatusLoadBalancerSchema,
})

export const IngressSchema = z.object({
  ingress: z.object({
    spec: IngressSpecSchema,
    status: IngressStatusSchema,
  }),
})

export const IngressResponseSchema = createV2ResourceResponseSchema(IngressSchema)
