import { http, HttpResponse } from 'msw'
import { clustersVersion2 } from '../data/clusters'
import nodes from '../data/nodes'
import { ingressesResponse } from '../data/ingresses'

export const v2ResourcesHandlers = [
  http.get('http://localhost:10000/v2/resources', ({ request }) => {
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url)

    const kind = url.searchParams.get('kind')

    switch (kind) {
      case 'KubernetesCluster':
        console.log('v2-resources: KubernetesCluster request received')
        console.log('v2-resources: Returning clustersVersion2 data')
        return HttpResponse.json(clustersVersion2)
      case 'Node':
        return HttpResponse.json(nodes)
      case 'Ingress':
        return HttpResponse.json(ingressesResponse)
      default:
        return HttpResponse.json(null)
    }
  }),

  http.get('http://localhost:10000/v2/resources/uid/:id', ({ params }) => {
    const { id } = params

    const flatResources = clustersVersion2.resources.flatMap((group) => group.resources)

    const cluster = flatResources.find(
      (res) => res.kind === 'KubernetesCluster' && res.kubernetescluster?.spec?.data.clusterId === id
    )

    if (!cluster) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    return HttpResponse.json(cluster)
  }),
]
