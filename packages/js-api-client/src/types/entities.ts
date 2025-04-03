import { z } from 'zod'
import { IngressSchema, IngressResponseSchema } from '../schemas/ingress'
import { KubernetesClusterSchema, KubernetesClusterResponseSchema } from '../schemas/kubernetes-cluster'
import { ClusterSchema, ClustersResponseSchema } from '../schemas/kubernetes-cluster-v1'
import { NodeSchema, NodeResponseSchema } from '../schemas/node'
import { UserSelfSchema } from '../schemas/user'

export type Ingress = z.infer<typeof IngressSchema>
export type IngressResponse = z.infer<typeof IngressResponseSchema>
// Cluster matches the v1 endpoint
export type Cluster = z.infer<typeof ClusterSchema>
export type ClustersResponse = z.infer<typeof ClustersResponseSchema>
// KubernetesCluster matches the v2 endpoint
export type KubernetesCluster = z.infer<typeof KubernetesClusterSchema>
export type KubernetesClusterResponse = z.infer<typeof KubernetesClusterResponseSchema>
export type Node = z.infer<typeof NodeSchema>
export type NodeResponse = z.infer<typeof NodeResponseSchema>
export type User = z.infer<typeof UserSelfSchema>
