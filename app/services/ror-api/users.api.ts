import { env } from "~/env";
import { RorApiClient } from "./client";
import type { RequestOptions } from "./types";

export class UsersAPI {
  private static client = new RorApiClient({
    baseUrl: env.PUBLIC_ROR_API_URL,
  });

  static async getSelf(options?: RequestOptions) {
    return this.client.get("/v2/self", options);
  }
}
