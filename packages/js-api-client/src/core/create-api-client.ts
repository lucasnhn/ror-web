import type { ApiClientConfig } from '../types/config'
import { generateRequest } from './request'
import { createKubernetesClusterService } from '../services/kubernetes-cluster'
import { createNodesService } from '../services/nodes'
import { createUsersService } from '../services/users'
import { createIngressesService } from '../services/ingresses'
import { createConfigurationService } from '../services/configuration'
import { createDeploymentService } from '../services/deployment'

function setDefaultHeaders(config: ApiClientConfig): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.accessToken}`,
    ...config.headers,
  }
}

export function createApiClient(config: ApiClientConfig) {
  /**
   * Setup default configuration
   */
  const defaultConfig: ApiClientConfig = {
    ...config,
    headers: setDefaultHeaders(config),
  }

  /**
   * Generate a request function that we can use to setup our different services
   * This is our core function that handles the request and response lifecycle
   */
  const request = generateRequest(defaultConfig)

  /**
   * Create our different services
   */
  const services = {
    kubernetesClusters: createKubernetesClusterService(request),
    nodes: createNodesService(request),
    users: createUsersService(request),
    ingresses: createIngressesService(request),
    configuration: createConfigurationService(request),
    Deployment: createDeploymentService(request),
  }

  return services
}
