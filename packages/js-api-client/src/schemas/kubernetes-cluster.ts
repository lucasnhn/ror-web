import { z } from 'zod'
import { createV2ResourceResponseSchema } from './common'

export const KubernetesClusterSpecToolingConfig = z
  .object({
    // TODO: Define the tooling config schema here as needed
  })
  .passthrough()

export const KubernetesClusterSpecProviderSpec = z
  .object({
    // TODO: Define the provider spec schema here as needed
  })
  .passthrough()

export const KubernetesClusterSpecTopology = z
  .object({
    // TODO: Define the topology schema here as needed
  })
  .passthrough()

export const KubernetesClusterSpecEndpoint = z
  .object({
    // TODO: Define the endpoint schema here as needed
  })
  .passthrough()

export const KubernetesClusterSpec = z.object({
  clusterId: z.string(),
  clusterName: z.string(),
  description: z.string(),
  project: z.string(),
  provider: z.string(),
  createdBy: z.string(),
  toolingConfig: KubernetesClusterSpecToolingConfig,
  environment: z.string(),
  providerSpec: KubernetesClusterSpecProviderSpec,
  topology: KubernetesClusterSpecTopology,
  endpoints: z.array(KubernetesClusterSpecEndpoint),
})

export const ResourceKubernetesClusterStatusCondition = z
  .object({
    // TODO: Define condition fields as needed
  })
  .passthrough()

export const KubernetesClusterStatus = z.object({
  status: z.string(),
  phase: z.string(),
  conditions: z.array(ResourceKubernetesClusterStatusCondition),
  kubernetesVersion: z.string(),
  providerStatus: z.record(z.string(), z.any()),
  createdTime: z.string(),
  updatedTime: z.string(),
  lastObservedTime: z.string(),
})

export const KubernetesClusterSchema = z.object({
  kubernetesCluster: z.object({
    // The spec defines how the cluster is configured and provisioned.
    // e.g. how it should be
    spec: KubernetesClusterSpec,
    // The status defines the current state of the cluster.
    // e.g. how it is
    status: KubernetesClusterStatus,
  }),
})

export const KubernetesClusterResponseSchema = createV2ResourceResponseSchema(KubernetesClusterSchema)
