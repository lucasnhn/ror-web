export class ApiError extends Error {
  public status: number
  public details?: string

  constructor(message: string, status: number, details?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, status: number, details?: string) {
    super(message, status, details)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string, details?: string) {
    super(message, 401, details)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string, details?: string) {
    super(message, 403, details)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details?: string) {
    super(message, 404, details)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends ApiError {
  public validationErrors: Record<string, string[]>

  constructor(message: string, validationErrors: Record<string, string[]>) {
    super(message, 422)
    this.name = 'ValidationError'
    this.validationErrors = validationErrors
  }
}

export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError
}
