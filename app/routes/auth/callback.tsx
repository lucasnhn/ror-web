import * as client from "openid-client";
import { redirect } from "react-router";
import {
  authCodeVerificationCookie,
  authStateCookie,
  discoverAuthMetadata,
  authAccessTokenCookie,
} from "~/services/auth/auth.service";
import type { Route } from "./+types/callback";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const cookieHeader = request.headers.get("Cookie");
    const state = url.searchParams.get("state");
    const storedCode = await authCodeVerificationCookie.parse(cookieHeader);
    const storedState = await authStateCookie.parse(cookieHeader);

    /**
     * Verify the state parameter from the callback
     */
    if (!state || state !== storedState) {
      throw new Error("Invalid state");
    }

    /**
     * Fetch tokens
     */
    const config = await discoverAuthMetadata();
    const tokens = await client.authorizationCodeGrant(config, request, {
      pkceCodeVerifier: storedCode,
      expectedState: storedState,
      idTokenExpected: true,
    });

    /**
     * Save our access_token in a secured cookie that can be retrieved inside of "loader" functions.

     * @example
     * export async function loader({ request }: Route.LoaderArgs) {
     *   const cookie = request.headers.get("Cookie");
     *   const accessToken = await authAccessTokenCookie.parse(cookie);
     *  // Do something with the token
     * }
     */
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      await authAccessTokenCookie.serialize(tokens.access_token)
    );

    /**
     * Ready to send our user to our protected landing page
     */
    const redirectTo = new URL("/dashboard", request.url);

    return redirect(redirectTo.toString(), {
      headers,
    });
  } catch (error) {
    console.error(error);
    // TODO: Add logging and more error handling
    return redirect("/login?error=callback_error");
  }
}

export function HydrateFallback() {
  return <p>Verifying authentication…</p>;
}

export default function CallbackRoute() {
  return (
    <div>
      <p>Verifying authentication…</p>
    </div>
  );
}
