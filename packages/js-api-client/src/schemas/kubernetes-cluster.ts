import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

export const KubernetesClusterSpecData = z.object({
  clusterId: z.string(),
  provider: z.string(),
  datacenter: z.string(),
  region: z.string(),
  zone: z.string(),
  project: z.string(),
  workspace: z.string(),
  workorder: z.string(),
  environment: z.string(),
})

// Extra metadata for machines
export const KubernetesClusterSpecMetadataDetails = z.object({
  labels: z.record(z.string(), z.string()), // stricter what you can have in label, so often used in selectors that give me those with this label
  annotations: z.record(z.string(), z.string()), // less strict, often just additional information
})

export const KubernetesClusterStorage = z.object({
  class: z.string(),
  path: z.string(),
  size: z.string(),
})

// Control plane: some machines in the cluster must hold processes internally in the cluster, so management. Often smaller because it only runs internal stuff. Master in master/slave terminology
// TODO: CHECK CAUSE THIS IS CHANGED
export const KubernetesClusterSpecControlPlane = z.object({
  replicas: z.number(),
  version: z.string(), // Kubernetes version
  provider: z.string(),
  machineClass: z.string(),
  metadata: KubernetesClusterSpecMetadataDetails,
  storage: z.array(KubernetesClusterStorage),
})

// If the user has enabled autoscaling, with configuration
export const KubernetesClusterAutoscalingConfig = z.object({
  enabled: z.boolean(),
  minReplicas: z.number(),
  maxReplicas: z.number(),
})

// Extends autoscalingconfig, adds scaling rules
const KubernetesClusterAutoscalingSpec = KubernetesClusterAutoscalingConfig.extend({
  scalingRules: z.array(z.string()),
})

// Store information about nodepool
// TODO: CHECK CAUSE THIS IS CHANGED
export const KubernetesClusterNodePool = z.object({
  machineClass: z.string(),
  provider: z.string(),
  version: z.string(), // Kubernetes version
  name: z.string(),
  replicas: z.number(), // Number of nodes
  autoscaling: KubernetesClusterAutoscalingSpec,
  metadata: KubernetesClusterSpecMetadataDetails,
})

// Worker is basically slave in master/slave terminology
export const KubernetesClusterWorkers = z.object({
  nodePools: z.array(KubernetesClusterNodePool),
})

// Specification of the cluster, what is used to create it
export const KubernetesClusterSpecTopology = z.object({
  version: z.string(), // Kubernetes version
  controlplane: KubernetesClusterSpecControlPlane, // Contains control plan configuration
  workers: KubernetesClusterWorkers, // Contains worker nodes configuration
})

export const KubernetesClusterSpec = z.object({
  data: KubernetesClusterSpecData.nullable().optional(),
  topology: KubernetesClusterSpecTopology.nullable().optional(),
})

// cpu, memory, gpu, disk
export const KubernetesClusterStatusClusterStatusResource = z.object({
  capacity: z.string(),
  used: z.string(),
  percentage: z.number(),
})

export const KubernetesClusterStatusClusterStatusResources = z.object({
  cpu: KubernetesClusterStatusClusterStatusResource.nullable().optional(),
  memory: KubernetesClusterStatusClusterStatusResource.nullable().optional(),
  gpu: KubernetesClusterStatusClusterStatusResource.nullable().optional(),
  disk: KubernetesClusterStatusClusterStatusResource.nullable().optional(),
})

export const KubernetesClusterNodePoolStatus = z.object({
  name: z.string(),
  status: z.string(),
  message: z.string(),
  scale: z.number(), // Number of nodes in the nodepool
  machineClass: z.string(), // Size of machines in nodes
  autoscaling: KubernetesClusterAutoscalingConfig,
  resources: KubernetesClusterStatusClusterStatusResources,
})

export const KubernetesClusterStatusPrice = z.object({
  monthly: z.number(),
  yearly: z.number(),
})

export const KubernetesClusterControlPlaneStatus = z.object({
  status: z.string(),
  message: z.string(),
  scale: z.number(),
  machineClass: z.string(),
  resources: KubernetesClusterStatusClusterStatusResources,
})

export const KubernetesClusterClusterDetails = z.object({
  externalId: z.string(), // Cluster's ID from the outside, for the ones who have made cluster, like Tanzu
  resources: KubernetesClusterStatusClusterStatusResources,
  price: KubernetesClusterStatusPrice,
  controlplane: KubernetesClusterControlPlaneStatus,
  nodepools: z.array(KubernetesClusterNodePoolStatus), // TODO: Check if this changed in ror repo
})

// NHN tooling, agent, kubernetes
export const KubernetesClusterVersion = z.object({
  name: z.string(),
  version: z.string(),
  branch: z.string(),
})

export const KubernetesClusterEndpoint = z.object({
  name: z.string(), // Name of the endpoint, "controlplane", "kubernetes", "api", "dashboard, grafana, argocd", "datacenter"
  address: z.string(), // Address of the endpoint
})

export const KubernetesClusterClusterState = z.object({
  cluster: KubernetesClusterClusterDetails,
  versions: z.array(KubernetesClusterVersion),
  endpoints: z.array(KubernetesClusterEndpoint),
  egressIP: z.string(), // IP that load balancers use to route traffic out of the cluster, used to reach the cluster from the outside, e.g. to firewalls
  lastUpdated: z.coerce.date(),
  lastUpdatedBy: z.string(),
  created: z.coerce.date(),
})

export const KubernetesClusterCondition = z.object({
  type: z.string(), // Type is the type of the condition. For example, "ready", "available", etc.
  status: z.string(), // Status is the status of the condition. Valid vales are: ok, warning, error, working, unknown.
  lastTransitionTime: z.string(), // LastTransitionTime is the last time the condition transitioned from one status to another.
  reason: z.string(), // Reason is a brief reason for the condition's last transition.
  message: z.string(), // Message is a human-readable message indicating details about the condition.
})

export const KubernetesClusterStatus = z.object({
  state: KubernetesClusterClusterState,
  phase: z.string(),
  conditions: z.array(KubernetesClusterCondition),
})

export const KubernetesClusterSchema = V2ResourceSchema.extend({
  kubernetescluster: z
    .object({
      // The spec defines how the cluster is configured and provisioned.
      // e.g. how it should be
      spec: KubernetesClusterSpec,
      // The status defines the current state of the cluster.
      // e.g. how it is
      status: KubernetesClusterStatus.nullable().optional(),
    })
    .nullable()
    .optional(),
})

export const KubernetesClusterResponseSchema = createV2ResourceResponseSchema(KubernetesClusterSchema)
