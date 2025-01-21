import * as client from "openid-client";
import { redirect } from "react-router";
import {
  authCodeVerificationCookie,
  authStateCookie,
  discoverAuthMetadata,
  authAccessTokenCookie,
} from "~/services/auth/auth.service";
import type { Route } from "./+types/callback";
import { useEffect } from "react";
import { useAuthentication } from "~/features/auth-provider/use-authentication";
import { useNavigate } from "react-router";

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

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      await authAccessTokenCookie.serialize(tokens.access_token)
    );

    const redirectTo = new URL("/dashboard", request.url);
    redirectTo.searchParams.append("access_token", tokens.access_token);
    if (tokens.id_token) {
      redirectTo.searchParams.append("id_token", tokens.id_token);
    }

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

export default function Component({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { setAccessToken, setIdToken } = useAuthentication();
  /**
   * Save the access token to local storage
   */
  useEffect(() => {
    if (params.id_token) {
      window.localStorage.setItem("__ror_id_token", params.id_token);
      setIdToken(params.id_token);
    }

    if (params.access_token) {
      window.localStorage.setItem("__ror_access_token", params.access_token);
      setAccessToken(params.access_token);
      navigate("/dashboard");
    }
  }, [
    params.access_token,
    params.id_token,
    navigate,
    setAccessToken,
    setIdToken,
  ]);

  return (
    <div>
      <p>Callback</p>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
