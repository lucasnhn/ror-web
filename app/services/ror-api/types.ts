/**
 * Configuration for setting up our ROR API Client
 * @param baseUrl - The base url for the ROR API
 * @param accessToken - The access token for the ROR API
 * @param headers - Any additional headers to include in requests
 * @param timeout - The timeout for requests
 */
export interface ClientConfig {
  baseUrl: string;
  accessToken?: string;
  timeout?: number;
  headers?: Headers;
}

export interface RequestOptions {
  headers?: Headers;
  accessToken?: string;
  timeout?: number;
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface APIResponse<T> {
  data: T;
  status: number;
}

export interface APIError {
  message: string;
  status: number;
}
