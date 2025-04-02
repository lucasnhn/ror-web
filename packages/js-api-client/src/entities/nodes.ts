import { z } from 'zod'

const NodeSpecTaint = z.object({
  effect: z.string(),
  key: z.string(),
})

const NodeSpecSchema = z.object({
  podCIDR: z.string().optional(),
  podCIDRs: z.array(z.string()).optional(),
  providerID: z.string().optional(),
  taints: z.array(NodeSpecTaint).optional(),
})

const NodeStatusAddress = z.object({
  address: z.string(),
  type: z.string(),
})

const NodeStatusCapacity = z.object({
  cpu: z.string(),
  ephemeralStorage: z.string(),
  memory: z.string(),
  pods: z.string(),
})

const NodeStatusCondition = z.object({
  lastHeartbeatTime: z.string(),
  lastTransitionTime: z.string(),
  message: z.string(),
  reason: z.string(),
  status: z.string(),
  type: z.string(),
})

const NodeStatusNodeInfo = z.object({
  architecture: z.string(),
  bootID: z.string(),
  containerRuntimeVersion: z.string(),
  kernelVersion: z.string(),
  kubeProxyVersion: z.string(),
  kubeletVersion: z.string(),
  machineID: z.string(),
  operatingSystem: z.string(),
  osImage: z.string(),
  systemUUID: z.string(),
})

const NodeStatusSchema = z.object({
  addresses: z.array(NodeStatusAddress),
  capacity: NodeStatusCapacity,
  conditions: z.array(NodeStatusCondition),
  nodeInfo: NodeStatusNodeInfo,
})

export const NodeSchema = z.object({
  // How it should be
  spec: NodeSpecSchema,
  // How it is right now
  status: NodeStatusSchema,
})

export const NodesSchema = z.array(NodeSchema)
