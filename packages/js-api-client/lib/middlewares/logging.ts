import type { Middleware } from '../types'

export const loggingMiddleware: Middleware = (next) => async (config) => {
  console.log('js-api-sdk: (%s) %s', config.method, config.baseUrl + config.path)
  return next(config)
}
