import { env } from "@/env";
import { createApiClient, loggingMiddleware } from "@ror/js-api-sdk";

export const rorApiClient = (accessToken: string) => {
  const middlewares = [loggingMiddleware];
  const config = {
    baseUrl: env.NEXT_PUBLIC_ROR_API_URL,
    accessToken,
  };
  return createApiClient(config, middlewares);
};
