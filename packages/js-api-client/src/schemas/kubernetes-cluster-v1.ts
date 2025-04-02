import { z } from 'zod'
import { createPaginationSchema } from './common'

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

const VersionsModel = z.object({
  nhnTooling: NhnToolingModel.passthrough(),
  agent: AgentModel.optional(),
  kubernetes: z.string(),
})

const ProjectModel = z.object({
  name: z.string().optional(),
})

const MetadataModel = z.object({
  project: ProjectModel.optional(),
})

const DatacenterModel = z.object({
  name: z.string(),
  provider: z.string(),
  apiEndpoint: z.string(),
})

const WorkspaceModel = z.object({
  name: z.string(),
  datacenter: DatacenterModel,
})

const ControlPaneNodeModel = z.object({
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

const TopologyModel = z.object({
  controlPlaneEndpoint: z.string(),
  egressIp: z.string(),
  controlPlane: z.object({
    nodes: z.array(ControlPaneNodeModel).nullish(),
  }),
})

const AclModel = z.object({
  accessGroups: z.array(z.string()),
})

export const ClusterSchema = z
  .object({
    clusterId: z.string(),
    clusterName: z.string(),
    created: z.string(),
    environment: z.string(),
    healthStatus: z.object({
      health: z.number(),
    }),
    firstObserved: z.string(),
    lastObserved: z.string(),
    metadata: MetadataModel,
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
    topology: TopologyModel,
    versions: VersionsModel,
    workspace: WorkspaceModel,
    ingresses: z
      .union([
        z.array(
          z
            .object({
              ingressrules: z
                .array(
                  z
                    .object({
                      hostname: z.string().optional(),
                    })
                    .optional()
                )
                .optional(),
            })
            .optional()
        ),
        z.null(),
      ])
      .optional(),
    acl: AclModel,
  })
  .passthrough()

export const ClustersResponseSchema = createPaginationSchema(ClusterSchema)
