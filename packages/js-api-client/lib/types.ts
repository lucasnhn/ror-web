export interface ApiClientConfig {
  /**
   * The base URL for the API client. For example: `https://api.example.com/v1`
   */
  baseUrl: string

  /**
   * Access token used for authentication with the API
   */
  accessToken: string

  /**
   * Optional custom headers to include with all API requests
   */
  headers?: HeadersInit

  /**
   * Optional configuration for retry behavior on failed requests
   */
  retryPolicy?: RetryPolicyConfig
}

export interface RetryPolicyConfig {
  /**
   * Maximum number of retry attempts for failed requests
   */
  maxRetries?: number

  /**
   * Time in milliseconds to wait between retry attempts
   */
  retryInterval?: number
}

export interface FetchConfig {
  method: string
  headers: HeadersInit
  body?: string
}

export interface RequestConfig<T extends object = {}> {
  baseUrl: string
  path: string
  method: string
  body?: T
  headers?: HeadersInit
}

export type ApiRequest<R, T extends object> = (config: RequestConfig<T>) => Promise<R>

export type Middleware = (
  next: (config: RequestConfig) => Promise<unknown>
) => (config: RequestConfig) => Promise<unknown>
