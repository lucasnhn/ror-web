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

export async function discoverAuthMetadata(): Promise<client.Configuration> {
  const options: client.DiscoveryRequestOptions = {
    // "allowInsecureRequests" is deprecated but used for local development
    execute: env.PUBLIC_DEV_MODE ? [client.allowInsecureRequests] : [],
  };

  return client.discovery(
    new URL(env.AUTH_ISSUER),
    env.AUTH_CLIENT_ID,
    env.AUTH_CLIENT_SECRET,
    undefined,
    options
  );
}
