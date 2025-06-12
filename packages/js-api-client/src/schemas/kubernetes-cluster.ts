import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

export const ResourceMetadataOwnerReference = z.object({
  apiVersion: z.string().nullable().optional(),
  kind: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  uid: z.string().nullable().optional(),
})

export const Metadata = z.object({
  name: z.string().nullable().optional(),
  resourceVersion: z.string().nullable().optional(),
  creationTimestamp: z.string().nullable().optional(),
  labels: z.record(z.string(), z.string()).nullable().optional(),
  annotations: z.record(z.string(), z.string()).nullable().optional(),
  uid: z.string().nullable().optional(),
  namespace: z.string().nullable().optional(),
  generation: z.number().nullable().optional(),
  ownerReferences: z.array(ResourceMetadataOwnerReference),
})

export const SpecToolingConfig = z.object({
  splunkIndex: z.string().nullable().optional(),
})

export const SpecProviderSpecTanzuSpec = z.object({
  supervisorClusterName: z.string().nullable().optional(),
  namespace: z.string().nullable().optional(),
})

export const SpecProviderSpecAzureSpec = z.object({
  subscriptionId: z.string().nullable().optional(),
  resourceGroup: z.string().nullable().optional(),
})

export const SpecProviderSpec = z.object({
  tanzuSpec: SpecProviderSpecTanzuSpec,
  azureSpec: SpecProviderSpecAzureSpec,
})

export const SpecTopologyControlPlane = z.object({
  replicas: z.number().nullable().optional(),
  version: z.string().nullable().optional(),
  machineClass: z.string().nullable().optional(),
})

export const SpecTopologyWorkers = z.object({
  name: z.string().nullable().optional(),
  replicas: z.number().nullable().optional(),
  version: z.string().nullable().optional(),
  machineClass: z.string().nullable().optional(),
})

export const SpecTopology = z.object({
  controlPlane: SpecTopologyControlPlane.nullable().optional(),
  workers: z.array(SpecTopologyWorkers).nullable().optional(),
})

export const SpecEndpoint = z.object({
  type: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
})

export const Spec = z.object({
  clusterId: z.string().nullable().optional(),
  clusterName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  project: z.string().nullable().optional(),
  provider: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  toolingConfig: SpecToolingConfig.nullable().optional(),
  environment: z.string().nullable().optional(),
  providerSpec: SpecProviderSpec.nullable().optional(),
  topology: SpecTopology.nullable().optional(),
  endpoints: z.array(SpecEndpoint).nullable().optional(), // TODO: check if this is removed in ror
})

export const StatusCondition = z.object({
  type: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  lastTransitionTime: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
})

export const StatusClusterStatusPrice = z.object({
  monthly: z.number().nullable().optional(),
  yearly: z.number().nullable().optional(),
})

export const StatusClusterStatusResource = z.object({
  capacity: z.string().nullable().optional(),
  used: z.string().nullable().optional(),
  percentage: z.number().nullable().optional(),
})

export const StatusClusterStatus = z.object({
  price: StatusClusterStatusPrice,
  nodePools: z.number().nullable().optional(),
  nodes: z.number().nullable().optional(),
  cpu: StatusClusterStatusResource,
  memory: StatusClusterStatusResource,
  gpu: StatusClusterStatusResource,
  disk: StatusClusterStatusResource,
})

export const Status = z.object({
  status: z.string().nullable().optional(),
  endpoints: z.array(SpecEndpoint).nullable().optional(),
  phase: z.string().nullable().optional(),
  conditions: z.array(StatusCondition).nullable().optional(),
  kubernetesVersion: z.string().nullable().optional(),
  providerStatus: z.record(z.unknown()).nullable().optional(),
  createdTime: z.string().nullable().optional(),
  updatedTime: z.string().nullable().optional(),
  lastObservedTime: z.string().nullable().optional(),
  clusterStatus: StatusClusterStatus,
})

export const KubernetesClusterSchema = V2ResourceSchema.extend({
  // TODO: consider if the setup of z.object({kubernetesCluster: z.object({...})}) is the best way to structure this.
  kubernetescluster: z
    .object({
      apiVersion: z.string(),
      kind: z.string(),
      metaData: Metadata,
      spec: Spec,
      status: Status.nullable().optional(),
    })
    .nullable()
    .optional(),
})

export const KubernetesClusterResponseSchema = createV2ResourceResponseSchema(KubernetesClusterSchema)
