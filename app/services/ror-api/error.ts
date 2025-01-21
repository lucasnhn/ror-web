export class RorAPIError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class RorUnauthorized extends RorAPIError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class RorForbidden extends RorAPIError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class RorNotFound extends RorAPIError {
  constructor(message: string) {
    super(message, 404);
  }
}

export function isRorApiError(error: any): error is RorAPIError {
  return error instanceof RorAPIError;
}
