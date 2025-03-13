import { z } from 'zod'
import { Cluster, ClusterListItem } from './clusters.model'

export type ClusterType = z.infer<typeof Cluster>
export type ClusterListItemType = z.infer<typeof ClusterListItem>
