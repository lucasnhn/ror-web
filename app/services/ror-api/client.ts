import { env } from "~/env";
import type {
  APIError,
  APIResponse,
  ClientConfig,
  HTTPMethod,
  RequestOptions,
} from "./types";
import {
  RorAPIError,
  RorForbidden,
  RorNotFound,
  RorUnauthorized,
} from "./error";

export class RorApiClient {
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    const headers = new Headers(config.headers);
    if (config.accessToken) {
      headers.append("Authorization", `Bearer ${config.accessToken}`);
    }
    headers.append("Content-Type", "application/json");
    this.config = {
      ...config,
      headers,
    };
  }

  public setAccessToken(accessToken: string): void {
    if (this.config.headers) {
      this.config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  private async request<T>(
    method: HTTPMethod,
    endpoint: string,
    options?: RequestOptions,
    body?: unknown
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeout = options?.timeout || this.config.timeout;

    const timeoutId = timeout
      ? setTimeout(() => controller.abort(), timeout)
      : null;

    const headers = new Headers(this.config.headers);
    if (options?.headers) {
      options.headers.forEach((value, name) => headers.set(name, value));
    }

    if (options?.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new RorAPIError(response.statusText, response.status);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      if (error instanceof RorAPIError) {
        if (error.status === 401) {
          throw new RorUnauthorized(error.message);
        } else if (error.status === 403) {
          throw new RorForbidden(error.message);
        } else if (error.status === 404) {
          throw new RorNotFound(error.message);
        } else {
          throw error;
        }
      }

      throw error;
    }
  }

  public get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    return this.request<T>("GET", endpoint, options);
  }

  public post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    return this.request<T>("POST", endpoint, options, body);
  }

  public put<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    return this.request<T>("PUT", endpoint, options, body);
  }

  public delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    return this.request<T>("DELETE", endpoint, options);
  }
}

export const rorApiClient = new RorApiClient({
  baseUrl: env.PUBLIC_ROR_API_URL,
});
