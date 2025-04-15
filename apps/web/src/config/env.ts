import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'
import { env as windowEnv } from 'next-runtime-env'

/**
 * Hack to circumvent how @t3-oss/env-nextjs handles client facing environment variables
 * @see https://github.com/t3-oss/t3-env/issues/85
 *
 * @remarks
 * Each time a client-facing environment variable is accessed,
 * it will first be read from the server environment variables, if it's not found there,
 * it will be read from the client environment variables.
 *
 * This should only be used for client-facing variables, i.e. those prefixed with NEXT_PUBLIC_.
 */
const readVariable = (key: string | undefined) => {
  if (!key) throw new Error(`You must provide a key to readVariable`)

  /**
   * Load environment variables from the server if we're not in the browser.
   */
  if (typeof window === 'undefined') {
    return process.env[key]
  }
  /**
   * Load environment variables from the client if we're in the browser.
   * using `next-runtime-env` that has loaded the NEXT_PUBLIC_ prefixed variables into the window object.
   *
   * @see {@link layout.tsx} for implementation of the <PublicEnvScript /> component which
   * loads the NEXT_PUBLIC_ prefixed variables into the window object.
   */
  return windowEnv(key)
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
    NEXT_PUBLIC_MOCKING_ENABLED: z.string().default('false'),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    // Secret for signing tokens
    AUTH_SECRET: process.env.AUTH_SECRET,
    // Auth server
    AUTH_ISSUER: process.env.AUTH_ISSUER,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    // Weather or not to trust the host header
    // This is useful when running in a docker instance
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    // The base url to the ROR API
    NEXT_PUBLIC_ROR_API_URL: readVariable('NEXT_PUBLIC_ROR_API_URL'),
    // Enable mocking of API responses, see __mocks__
    NEXT_PUBLIC_MOCKING_ENABLED: readVariable('NEXT_PUBLIC_MOCKING_ENABLED'),
  },
})
