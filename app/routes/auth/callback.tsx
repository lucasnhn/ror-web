import * as client from "openid-client";
import { redirect } from "react-router";
import {
  authCodeVerificationCookie,
  authStateCookie,
  authIdTokenCookie,
  discoverAuthMetadata,
} from "~/services/auth/auth.service";
import type { Route } from "./+types/callback";
import { useEffect } from "react";
import { useAuthentication } from "~/features/auth-provider/use-authentication";

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

    return {
      access_token: tokens?.access_token,
      id_token: tokens?.id_token,
    };
  } catch (error) {
    console.error(error);
    // TODO: Add logging and more error handling
    return redirect("/login?error=callback_error");
  }
}

export function HydrateFallback() {
  return <p>Verifying authentication…</p>;
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { setAccessToken, setIdToken } = useAuthentication();
  /**
   * Save the access token to local storage
   */
  useEffect(() => {
    if (loaderData.access_token) {
      window.localStorage.setItem(
        "__ror_access_token",
        loaderData.access_token
      );
      setAccessToken(loaderData.access_token);
    }

    if (loaderData.id_token) {
      window.localStorage.setItem("__ror_id_token", loaderData.id_token);
      setIdToken(loaderData.id_token);
    }
  }, [loaderData.access_token, loaderData.id_token]);

  return (
    <div>
      <p>Callback</p>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
