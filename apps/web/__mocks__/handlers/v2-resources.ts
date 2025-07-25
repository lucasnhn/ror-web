import { http, HttpResponse } from 'msw'
import { clustersVersion2 } from '../data/clusters'
import nodes from '../data/nodes'
import { ingressesResponse } from '../data/ingresses'

/**
 * Define mock handlers for v2 resource-related endpoints
 */
export const v2ResourcesHandlers = [
  // Handle GET requests to /v2/resources with optional ?kind= query param
  http.get('http://localhost:10000/v2/resources', ({ request }) => {
    // Parse the URL from the incoming request
    const url = new URL(request.url)

    // Extract the 'kind' query parameter (e.g., 'KubernetesCluster', 'Node', 'Ingress')
    const kind = url.searchParams.get('kind')

    // Return mock data based on the requested kind
    switch (kind) {
      case 'KubernetesCluster':
        return HttpResponse.json(clustersVersion2) // Return all cluster data
      case 'Node':
        return HttpResponse.json(nodes) // Return all node data
      case 'Ingress':
        return HttpResponse.json(ingressesResponse) // Return all ingress data
      default:
        return HttpResponse.json(null) // If unknown kind, return null
    }
  }),

  // Handle GET requests to /v2/resources/uid/:id to fetch a resource by unique ID
  http.get('http://localhost:10000/v2/resources/uid/:id', ({ params }) => {
    const { id } = params // Extract the resource ID from the URL

    // Find a cluster resource with the matching clusterId
    const cluster = clustersVersion2.resources.find(
      (res) => res.kind === 'KubernetesCluster' && res.kubernetescluster?.spec?.data.clusterId === id
    )

    // Return 404 if not found
    if (!cluster) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    // Return the found cluster resource
    return HttpResponse.json(cluster)
  }),
]
