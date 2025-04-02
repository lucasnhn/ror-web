import { http, HttpResponse } from 'msw'
import { getRorAPIPath } from '../utils/mock-base-url'
import nodes from '../data/nodes'

export const nodesHandlers = [
  http.get(getRorAPIPath('/v2/resources'), () => {
    return HttpResponse.json(nodes)
  }),
  http.get(
    'http://localhost:10000/v2/resources%3Fkind=Node&apiversion=general.ror.internal%2Fv1alpha1&ownerScope=cluster&ownerSubject=aaa-001-dev-kgfh',
    () => {
      return HttpResponse.json(nodes)
    }
  ),
]
