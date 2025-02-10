import type { Middleware } from '../types'

export const loggingMiddleware: Middleware = (next) => async (config) => {
  const start = Date.now()
  const time = Date.now() - start
  console.log('ror-api: (%s) %s - took %dms', config.method, config.path, time)
  return next(config)
}
