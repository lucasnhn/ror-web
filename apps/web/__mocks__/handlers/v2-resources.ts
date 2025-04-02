import { http, HttpResponse } from 'msw'
import { clustersVersion2 } from '../data/clusters'
import nodes from '../data/nodes'

export const v2ResourcesHandlers = [
  http.get('http://localhost:10000/v2/resources', ({ request }) => {
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url)

    const kind = url.searchParams.get('kind')

    switch (kind) {
      case 'KubernetesCluster':
        return HttpResponse.json(clustersVersion2)
      case 'Node':
        return HttpResponse.json(nodes)
      default:
        return HttpResponse.json(null)
    }
  }),
]
