import { authAccessTokenCookie } from "~/services/auth/auth.service";
import type { Route } from "./+types/dashboard";

import { data } from "react-router";
import {
  isRorApiError,
  RorNotFoundError,
  RorForbiddenError,
  RorUnauthorizedError,
} from "~/services/ror-api-client";
import { rorApiClient } from "~/utils/ror-api";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookie = request.headers.get("Cookie");
    const token = await authAccessTokenCookie.parse(cookie);
    const client = rorApiClient(token);
    const self = await client.users.self();
    return {
      self: self,
    };
  } catch (error) {
    if (isRorApiError(error)) {
      if (error instanceof RorUnauthorizedError) {
        throw data("Unauthorized", { status: 401 });
      } else if (error instanceof RorForbiddenError) {
        throw data("Forbidden", { status: 403 });
      } else if (error instanceof RorNotFoundError) {
        throw data("Not Found", { status: 404 });
      } else {
        throw data("Unknown API error occured", { status: 500 });
      }
    }
    throw error;
  }
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
