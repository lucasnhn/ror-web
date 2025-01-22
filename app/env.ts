import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    AUTH_ISSUER: z.string().url(),
    AUTH_CLIENT_ID: z.string().min(1),
    AUTH_CLIENT_SECRET: z.string().min(1),
    AUTH_REDIRECT_URI: z.string().url(),
    SIGNING_SECRET: z.string().min(1),
    /**
     * A flag that is used for our authorization library to allow or disallow HTTP requests.
     * @default true
     */
    FORCE_TLS: z.union([z.literal("true"), z.literal("false")]).default("true"),
  },
  /**
   * Environment variables available on the client (and server).
   */
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_ROR_API_URL: z.string().url(),
    PUBLIC_DEV_MODE: z.boolean(),
  },
  /**
   * The runtime environment variables mapped to our `server` and `client` schemas.
   *
   * @remarks
   * `import.meta.env` is a Vite specific feature.
   */
  runtimeEnv: {
    AUTH_ISSUER: import.meta.env.VITE_AUTH_ISSUER,
    AUTH_CLIENT_ID: import.meta.env.VITE_AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: import.meta.env.VITE_AUTH_CLIENT_SECRET,
    AUTH_REDIRECT_URI: import.meta.env.VITE_AUTH_REDIRECT_URI,
    SIGNING_SECRET: import.meta.env.VITE_SIGNING_SECRET,
    PUBLIC_ROR_API_URL: import.meta.env.VITE_ROR_API_URL,
    FORCE_TLS: import.meta.env.VITE_FORCE_TLS,
    PUBLIC_DEV_MODE: import.meta.env.DEV,
  },
});
