import { RequestOptions } from '../types/request'
import { ApiError, NetworkError, AuthenticationError, AuthorizationError, NotFoundError } from './errors'

export async function makeRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options: RequestOptions,
  data?: any,
  queryParams?: Record<string, any>
): Promise<T> {
  const url = new URL(path, options.baseUrl)

  // Add query parameters if provided
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${options.accessToken}`,
    ...options.headers,
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  }

  try {
    const response = await fetch(url.toString(), fetchOptions)

    if (!response.ok) {
      handleErrorResponse(response)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new NetworkError('Network error occurred', 500, String(error))
  }
}

function handleErrorResponse(response: Response): never {
  switch (response.status) {
    case 401:
      throw new AuthenticationError(response.statusText || 'Unauthorized')
    case 403:
      throw new AuthorizationError(response.statusText || 'Forbidden')
    case 404:
      throw new NotFoundError(response.statusText || 'Not found')
    default:
      throw new ApiError(response.statusText || 'API error', response.status)
  }
}
