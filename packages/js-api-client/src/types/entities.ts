import { z } from 'zod'
import { IngressSchema, IngressResponseSchema } from '../schemas/ingress'
import { KubernetesClusterSchema, KubernetesClusterResponseSchema } from '../schemas/kubernetes-cluster'
import { ClusterIngressModelV1, ClusterSchema, ClustersResponseSchema } from '../schemas/kubernetes-cluster-v1'
import { NodeSchema, NodeResponseSchema } from '../schemas/node'
import { UserSelfSchema } from '../schemas/user'
import { PodResponseSchema, PodSchema } from '../schemas/pod'
import { DeploymentResponseSchema, DeploymentSchema } from '../schemas/deployment'
import { ServiceSchema, ServiceResponseSchema } from '../schemas/service'
import { ReplicaSetSchema, ReplicaSetResponseSchema } from '../schemas/replicaset'
import { DaemonSetResponseSchema, DaemonSetSchema } from '../schemas/Daemonset'
import { ConfigurationSchema, configurationResponseSchema } from '../schemas/configuration'
import { VulnerabilityReportResponseSchema, VulnerabilityReportSchema } from '../schemas/vulnerabilityReport'

export type Ingress = z.infer<typeof IngressSchema>
export type IngressResponse = z.infer<typeof IngressResponseSchema>
// "Cluster" matches the v1 resource
export type Cluster = z.infer<typeof ClusterSchema>
export type ClustersResponse = z.infer<typeof ClustersResponseSchema>
export type ClusterIngress = z.infer<typeof ClusterIngressModelV1>
// "KubernetesCluster" matches the v2 resource
export type KubernetesCluster = z.infer<typeof KubernetesClusterSchema>
export type KubernetesClusterResponse = z.infer<typeof KubernetesClusterResponseSchema>
export type Node = z.infer<typeof NodeSchema>
export type NodeResponse = z.infer<typeof NodeResponseSchema>
export type User = z.infer<typeof UserSelfSchema>
export type Pod = z.infer<typeof PodSchema>
export type PodResponse = z.infer<typeof PodResponseSchema>
export type Deployment = z.infer<typeof DeploymentSchema>
export type DeploymentResponse = z.infer<typeof DeploymentResponseSchema>
export type Service = z.infer<typeof ServiceSchema>
export type ServiceResponse = z.infer<typeof ServiceResponseSchema>
export type ReplicaSet = z.infer<typeof ReplicaSetSchema>
export type ReplicaSetResponse = z.infer<typeof ReplicaSetResponseSchema>
export type DaemonSet = z.infer<typeof DaemonSetSchema>
export type DaemonSetResponse = z.infer<typeof DaemonSetResponseSchema>
export type Configuration = z.infer<typeof ConfigurationSchema>
export type ConfigurationResponse = z.infer<typeof configurationResponseSchema>
export type VulnerabilityReport = z.infer<typeof VulnerabilityReportSchema>
export type VulnerabilityReportResponse = z.infer<typeof VulnerabilityReportResponseSchema>
export type Replicaset = z.infer<typeof ReplicaSetSchema>
export type ReplicasetResponse = z.infer<typeof ReplicaSetResponseSchema>
