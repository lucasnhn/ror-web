export class RorApiError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'RorApiError'
    this.status = status
  }
}

export class RorUnauthorizedError extends RorApiError {
  constructor(message: string) {
    super(message, 401)
    this.name = 'RorUnauthorizedError'
  }
}

export class RorForbiddenError extends RorApiError {
  constructor(message: string) {
    super(message, 403)
    this.name = 'RorForbiddenError'
  }
}

export class RorNotFoundError extends RorApiError {
  constructor(message: string) {
    super(message, 404)
    this.name = 'RorNotFoundError'
  }
}

export function isRorApiError(error: any): error is RorApiError {
  return error instanceof RorApiError
}
