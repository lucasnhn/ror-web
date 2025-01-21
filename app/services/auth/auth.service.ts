import * as client from "openid-client";
import { createCookie } from "react-router";
import { env } from "~/env";

export const authStateCookie = createCookie("__ror_auth_state", {
  secure: env.PUBLIC_DEV_MODE ? false : true,
  path: "/",
  httpOnly: true,
  maxAge: 60 * 10, // 10 min
});

export const authCodeVerificationCookie = createCookie(
  "__ror_auth_code_verification",
  {
    secure: env.PUBLIC_DEV_MODE ? false : true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  }
);

export const authIdTokenCookie = createCookie("__ror_id_token", {
  secure: env.PUBLIC_DEV_MODE ? false : true,
  path: "/",
  httpOnly: false, // We want to access this in the client
  maxAge: 60 * 30, // 30 min
});

export const authAccessTokenCookie = createCookie("__ror_access_token", {
  secure: env.PUBLIC_DEV_MODE ? false : true,
  path: "/",
  httpOnly: true,
  maxAge: 60 * 30, // 30 min
});

/**
 * Retrieve the .well-known configuration from the Authorization Server.
 * @returns The configuration object.
 */
export async function discoverAuthMetadata(): Promise<client.Configuration> {
  const options: client.DiscoveryRequestOptions = {
    /**
     * "allowInsecureRequests" is marked as deprecated but used for local development to not have to deal with HTTPS.
     * When using production build, then we adhere to using HTTPS.
     */
    execute: env.PUBLIC_DEV_MODE ? [client.allowInsecureRequests] : [],
  };

  const serverUrl = new URL(env.AUTH_ISSUER);
  const clientId = env.AUTH_CLIENT_ID;
  const clientSecret = env.AUTH_CLIENT_SECRET;
  const metadata: Partial<client.ClientMetadata> = {
    client_secret: env.AUTH_CLIENT_SECRET,
  };
  const clientAuthentication: client.ClientAuth =
    client.ClientSecretPost(clientSecret);

  return client.discovery(
    serverUrl,
    clientId,
    metadata,
    clientAuthentication,
    options
  );
}
