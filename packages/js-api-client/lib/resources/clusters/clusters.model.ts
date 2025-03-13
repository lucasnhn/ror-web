import { z } from 'zod'
import { HealthSchema } from '../generic-models/health'

const VersionModel = z.object({
  version: z.string(),
})

const NhnToolingModel = VersionModel.extend({
  branch: z.string(),
  environment: z.string(),
})

const AgentModel = VersionModel.extend({
  sha: z.string(),
})

export const VersionsModel = z.object({
  nhnTooling: NhnToolingModel.passthrough(),
  agent: AgentModel.optional(),
  kubernetes: z.string(),
})

export const ProjectModel = z.object({
  name: z.string().optional(),
})

export const MetadataModel = z.object({
  project: ProjectModel.optional(),
})

export const DatacenterModel = z.object({
  name: z.string(),
  provider: z.string(),
  apiEndpoint: z.string(),
})

export const WorkspaceModel = z.object({
  name: z.string(),
  datacenter: DatacenterModel,
})

export const ControlPaneNodeModel = z.object({
  name: z.string(),
  role: z.literal('control-plane'),
  created: z.string(),
  osImage: z.string(),
  machineName: z.string(),
  metrics: z.object({
    priceMonth: z.number(),
    priceYear: z.number(),
    cpu: z.number(),
    memory: z.number(),
    cpuConsumed: z.number(),
    memoryConsumed: z.number(),
    cpuPercentage: z.number(),
    memoryPercentage: z.number(),
    nodePoolCount: z.number(),
    nodeCount: z.number(),
    clusterCount: z.number(),
  }),
  architecture: z.string(),
  containerRuntimeVersion: z.string(),
  kernelVersion: z.string(),
  kubeProxyVersion: z.string(),
  kubeletVersion: z.string(),
  operatingSystem: z.string(),
  machineClass: z.string(),
})

export const TopologyModel = z.object({
  controlPlaneEndpoint: z.string(),
  egressIp: z.string(),
  controlPlane: z.object({
    nodes: z.array(ControlPaneNodeModel),
  }),
})

export const Cluster = z
  .object({
    clusterId: z.string(),
    clusterName: z.string(),
    created: z.string(),
    environment: z.string(),
    healthStatus: z.object({
      health: HealthSchema,
    }),
    firstObserved: z.string(),
    lastObserved: z.string(),
    metadata: MetadataModel,
    metrics: z.object({
      cpu: z.number(),
      cpuPercentage: z.number(),
      memory: z.number(),
      memoryPercentage: z.number(),
    }),
    topology: TopologyModel,
    versions: VersionsModel,
    workspace: WorkspaceModel,
  })
  .passthrough()

export const ClusterListItem = Cluster.extend({
  topology: TopologyModel.extend({
    controlPlane: z.object({
      // Nodes are nullable when fetched from the "filter" endpoint
      nodes: z.array(ControlPaneNodeModel).nullable(),
    }),
  }),
})
