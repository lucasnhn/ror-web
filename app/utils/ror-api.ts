import { env } from "~/env";
import { createApiClient, loggingMiddleware } from "~/services/ror-api-client";

export const rorApiClient = (accessToken: string) => {
  const middlewares = [loggingMiddleware];
  const config = {
    baseUrl: env.PUBLIC_ROR_API_URL,
    accessToken,
  };
  return createApiClient(config, middlewares);
};
