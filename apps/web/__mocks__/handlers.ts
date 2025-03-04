import { http, HttpResponse } from 'msw'

import clusters from './data/clusters'
import { createPaginatedResponse, type PaginatedResponse } from './utils/paginated-response'
type Cluster = (typeof clusters)[number]

// We directly access process.env instead of using the `@/env` module since that is only applicable from within the Next.js server environment.
const rorBaseApiUrl = process.env.NEXT_PUBLIC_ROR_API_URL

// Append a path to the base URL
const path = (path: string) => `${rorBaseApiUrl}${path}`

export const handlers = [
  http.post<never, never, PaginatedResponse<Cluster>>(path('/v1/clusters/filter'), () => {
    const paginatedResponse = createPaginatedResponse(clusters)
    return HttpResponse.json(paginatedResponse)
  }),
  http.get(path('/v1/clusters/:clusterId'), ({ params }) => {
    const singleCluster = clusters.find((c) => c.clusterId === params.clusterId)

    if (!singleCluster) {
      return HttpResponse.json({ error: 'Cluster not found' }, { status: 404 })
    }

    return HttpResponse.json(singleCluster)
  }),
]
