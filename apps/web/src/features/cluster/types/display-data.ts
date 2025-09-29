/**
 * Represents the possible display data fields for a cluster card.
 */
export type ClusterCardDisplayData =
  | 'argocd'
  | 'grafana'
  | 'rorcli'
  | 'kubectl'
  | 'cpu'
  | 'memory'
  | 'gpu'
  | 'disk'
  | 'nodes'
  | 'monthlyPrice'
  | 'yearlyPrice'
  | 'agentVersion'
  | 'kubernetesVersion'
  | 'toolingVersion'
  | 'datacenterName'
  | 'datacenterProvider'
  | 'environment'
  | 'serviceTags'
