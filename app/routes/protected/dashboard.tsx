import { authAccessTokenCookie } from "~/services/auth/auth.service";
import { UsersAPI } from "~/services/ror-api/users.api";
import type { Route } from "./+types/dashboard";
import { env } from "~/env";
import { useEffect } from "react";
import { useAuthentication } from "~/features/auth-provider/use-authentication";
import { useSearchParams } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const token = await authAccessTokenCookie.parse(cookie);

  console.log("PUBLIC_ROR_API_URL", env.PUBLIC_ROR_API_URL);
  console.log("Dashboard token", token);

  const self = await UsersAPI.getSelf({
    accessToken: token,
  });

  return {
    url: env.PUBLIC_ROR_API_URL,
    token,
    self,
  };
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
