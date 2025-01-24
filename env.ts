import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    AUTH_SECRET: z.string().min(1),
    AUTH_ISSUER: z.string().url(),
    AUTH_CLIENT_ID: z.string().min(1),
    AUTH_CLIENT_SECRET: z.string().min(1),
  },
  /**
   * Environment variables available on the client (and server).
   */
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_ROR_API_URL: z.string().url(),
  },
  /**
   * The runtime environment variables mapped to our `server` and `client` schemas.
   *
   * @remarks
   * `import.meta.env` is a Vite specific feature.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_ISSUER: process.env.AUTH_ISSUER,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    PUBLIC_ROR_API_URL: process.env.ROR_API_URL,
  },
});
