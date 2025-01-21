import * as client from "openid-client";
import { redirect } from "react-router";
import { env } from "~/env";
import {
  authCodeVerificationCookie,
  authStateCookie,
  discoverAuthMetadata,
} from "~/services/auth/auth.service";

export async function loader() {
  try {
    /**
     * Value used in the authorization request as the redirect_uri parameter, this
     * is pre-registered at the Authorization Server.
     */
    const redirect_uri = env.AUTH_REDIRECT_URI;
    const scope = "openid profile email groups";

    /**
     * Retrieve the allowed configuration from the Authorization Server
     */
    const config = await discoverAuthMetadata();

    /**
     * Setup the authorization request
     */
    const parameters = new URLSearchParams();
    const headers = new Headers();

    let state: string;

    parameters.set("redirect_uri", redirect_uri);
    parameters.set("client_id", env.AUTH_CLIENT_ID);
    parameters.set("scope", scope);

    /**
     * PKCE flow specifics
     */
    const code_verifier: string = client.randomPKCECodeVerifier();
    const code_challenge: string = await client.calculatePKCECodeChallenge(
      code_verifier
    );
    parameters.set("code_challenge", code_challenge);
    parameters.set("code_challenge_method", "S256");
    headers.append(
      "Set-Cookie",
      await authCodeVerificationCookie.serialize(code_verifier)
    );

    /**
     * We cannot be sure the AS supports PKCE so we're going to use state too. Use
     * of PKCE is backwards compatible even if the AS doesn't support it which is
     * why we're using it regardless.
     */
    state = client.randomState();
    parameters.set("state", state);
    headers.append("Set-Cookie", await authStateCookie.serialize(state));

    /**
     * Create the authorization url
     */
    const redirectTo: URL = client.buildAuthorizationUrl(config, parameters);

    /**
     * Redirect the users to the authorization url for logging in
     */
    return redirect(redirectTo.toString(), {
      headers,
    });
  } catch (error) {
    console.log("error", error);
    if (error instanceof TypeError) {
      return redirect("/login?error=invalid_config");
    } else if (error instanceof client.ClientError) {
      return redirect(`/login?error=${error.code}`);
    } else {
      return redirect("/login?error=unknown");
    }
  }
}

export default function AuthorizeRoute() {
  return <p>Redirecting...</p>;
}
