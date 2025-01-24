export type ResourceClient = {
  get: <R>(path: string, headers?: HeadersInit) => Promise<R>;
  post: <R, T extends object = {}>(
    path: string,
    body: T,
    headers?: HeadersInit
  ) => Promise<R>;
  put: <R, T extends object = {}>(
    path: string,
    body: T,
    headers?: HeadersInit
  ) => Promise<R>;
  delete: <R>(path: string, headers?: HeadersInit) => Promise<R>;
};

export const createResource = (client: ResourceClient) => {
  return {
    get: <R>(path: string, headers?: HeadersInit) =>
      client.get<R>(path, headers),
    post: <R, T extends object>(path: string, body: T, headers?: HeadersInit) =>
      client.post<R, T>(path, body, headers),
    put: <R, T extends object>(path: string, body: T, headers?: HeadersInit) =>
      client.put<R, T>(path, body, headers),
    delete: <R>(path: string, headers?: HeadersInit) =>
      client.delete<R>(path, headers),
  };
};
