import { clustersHandlers } from './handlers/clusters'
import { v2ResourcesHandlers } from './handlers/v2-resources'

/**
 * Mock handlers for the application.
 */
export const handlers = [...clustersHandlers, ...v2ResourcesHandlers]
