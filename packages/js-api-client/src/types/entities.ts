import { z } from 'zod'
import { KubernetesClusterSchema } from '../entities/kubernetes-cluster'

export type KubernetesCluster = z.infer<typeof KubernetesClusterSchema>
