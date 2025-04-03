import { clustersHandlers } from './handlers/clusters'
import { v2ResourcesHandlers } from './handlers/v2-resources'

export const handlers = [...clustersHandlers, ...v2ResourcesHandlers]
