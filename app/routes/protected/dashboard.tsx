import { authAccessTokenCookie } from "~/services/auth/auth.service";
import { UsersAPI } from "~/services/ror-api/users.api";
import type { Route } from "./+types/dashboard";
import {
  isRorApiError,
  RorForbidden,
  RorNotFound,
  RorUnauthorized,
} from "~/services/ror-api/error";
import { data } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const token = await authAccessTokenCookie.parse(cookie);
  try {
    const self = await UsersAPI.getSelf({
      accessToken: token,
    });

    return {
      self,
    };
  } catch (error) {
    if (isRorApiError(error)) {
      if (error instanceof RorUnauthorized) {
        throw data("Unauthorized", { status: 401 });
      } else if (error instanceof RorForbidden) {
        throw data("Forbidden", { status: 403 });
      } else if (error instanceof RorNotFound) {
        throw data("Not Found", { status: 404 });
      } else {
        throw data("Unknown API error occured", { status: 500 });
      }
    }
    return {
      message: "Unknown error occured",
    };
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
