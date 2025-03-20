import { http, HttpResponse } from 'msw'
import { alphabetical } from 'radash'

import clusters from './data/clusters'
import { createPaginatedResponse, type PaginatedResponse } from './utils/paginated-response'
type Cluster = (typeof clusters)[number]

// We directly access process.env instead of using the `@/env` module since that is only applicable from within the Next.js server environment.
const rorBaseApiUrl = process.env.NEXT_PUBLIC_ROR_API_URL

// Append a path to the base URL
const path = (path: string) => `${rorBaseApiUrl}${path}`

interface FilterBody {
  limit?: number
  skip?: number
  sort?: [
    {
      sortField: 'clusterName'
      sortOrder: 1 | -1
    },
  ]
}

export const handlers = [
  http.post<never, FilterBody, PaginatedResponse<Cluster>>(path('/v1/clusters/filter'), async ({ request }) => {
    // Read the intercepted request body as JSON.
    const payload = await request.json()
    const pagination = {
      limit: payload?.limit ?? 10,
      skip: payload?.skip ?? 0,
    }

    let filteredClusters = [...clusters]

    if (Array.isArray(payload?.sort) && payload.sort.length > 0 && payload.sort[0].sortField === 'clusterName') {
      const sortByField = payload.sort[0].sortField
      const sortOrder = payload.sort[0].sortOrder === -1 ? 'desc' : 'asc'
      console.log('mock - sorting, field: %s, order: %s', sortByField, sortOrder)
      filteredClusters = alphabetical(clusters, (c) => c.clusterName, sortOrder)
    }

    const paginatedResponse = createPaginatedResponse(pagination, filteredClusters)

    console.log(
      'mock – sortedClusters:',
      filteredClusters.map((cluster) => cluster.clusterName)
    )

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
