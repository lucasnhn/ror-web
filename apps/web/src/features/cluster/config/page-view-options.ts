import { Option } from '@/components/shadcn/multiselect'
import { Environment, environmentValues } from '../types/environment'

export const displayDataOptions: Option[] = [
  { value: 'argocd', label: 'ArgoCD' },
  { value: 'grafana', label: 'Grafana' },
  { value: 'rorcli', label: 'ROR CLI' },
  { value: 'kubectl', label: 'Kubectl' },
  { value: 'cpu', label: 'CPU usage' },
  { value: 'memory', label: 'Memory usage' },
  { value: 'gpu', label: 'GPU usage' },
  { value: 'disk', label: 'Disk usage' },
  { value: 'nodes', label: 'Num of nodes' },
  { value: 'monthlyPrice', label: 'Monthly price' },
  { value: 'yearlyPrice', label: 'Yearly price' },
  { value: 'agentVersion', label: 'ROR agent version' },
  { value: 'kubernetesVersion', label: 'Kubernetes version' },
  { value: 'toolingVersion', label: 'NHN tooling version' },
  { value: 'datacenterName', label: 'Datacenter name' },
  { value: 'datacenterProvider', label: 'Datacenter provider' },
  { value: 'environment', label: 'Environment' },
  { value: 'serviceTags', label: 'Service tags' },
]

export const sortingOptions = [
  { value: 'clusterName', label: 'Cluster name' },
  { value: 'cpu', label: 'CPU usage' },
  { value: 'memory', label: 'Memory usage' },
  { value: 'nodes', label: 'Num of nodes' },
  { value: 'monthlyPrice', label: 'Price' },
  { value: 'datacenterName', label: 'Datacenter' },
  { value: 'datacenterProvider', label: 'Datacenter provider' },
  { value: 'environment', label: 'Environment' },
]

const toLabel = (env: Environment): string => {
  if (env === 'qa') return 'QA'
  return env.charAt(0).toUpperCase() + env.slice(1)
}

export const environments: Option[] = environmentValues.map((env) => ({
  value: env,
  label: toLabel(env),
}))

export const datacenters: Option[] = [
  { value: 'trd1-tanzu', label: 'trd1 - tanzu' },
  { value: 'osl1-tanzu', label: 'osl1 - tanzu' },
  { value: 'trd1cl02-tanzu', label: 'trd1cl02 - tanzu' },
  { value: 'norwayeast-aks', label: 'norwayeast - aks' },
  { value: 'trd1-talos', label: 'trd1 - talos' },
]

export const workspaces: Option[] = [
  { value: 'trd1-amk-prod', label: 'trd1-amk-prod' },
  { value: 'trd1cl02-shp-prod', label: 'trd1cl02-shp-prod' },
  { value: 'trd1cl02-dcn', label: 'trd1cl02-dcn' },
  { value: 't-nhn', label: 't-nhn' },
  { value: 'trd1-amk', label: 'trd1-amk' },
  { value: 'trd1-app', label: 'trd1-app' },
  { value: 'trd1-team-kjernejournal-portal', label: 'trd1-team-kjernejournal-portal' },
]

export const filterOptions = [
  { label: 'Environments', placeholder: 'Set environments', data: environments },
  { label: 'Datacenters', placeholder: 'Set datacenters', data: datacenters },
  { label: 'Workspaces', placeholder: 'Set workspaces', data: workspaces },
]
