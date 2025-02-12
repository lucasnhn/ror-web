import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Hack to circumvent how @t3-oss/env-nextjs handles environment variables that
 * should be picked up by the runtime but are not.
 * @see https://github.com/t3-oss/t3-env/issues/85
 *
 * @remarks
 * This should only be used for client-facing variables, i.e. those prefixed with NEXT_PUBLIC_.
 */
const readVariable = (key: string | undefined) => {
  if (!key) throw new Error(`Environment variable ${key} not found`)
  if (typeof window === 'undefined') return process.env[key]
  // @ts-expect-error - __ENV is injected by next.js
  return window.__ENV[key]
}

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
    AUTH_TRUST_HOST: z.string().min(1),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_ROR_API_URL: z.string().url(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_ISSUER: process.env.AUTH_ISSUER,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    NEXT_PUBLIC_ROR_API_URL: readVariable(process.env.NEXT_PUBLIC_ROR_API_URL),
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  },
})
