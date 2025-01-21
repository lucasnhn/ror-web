import { env } from "~/env";
import { RorApiClient } from "./client";
import type { RequestOptions } from "./types";
import { z } from "zod";
import { SelfApiResponse } from "./models/self";

export class UsersAPI {
  private static client = new RorApiClient({
    baseUrl: env.PUBLIC_ROR_API_URL,
  });

  static async getSelf(options?: RequestOptions) {
    const data = await this.client.get<z.infer<typeof SelfApiResponse>>(
      "/v2/self",
      options
    );
    return SelfApiResponse.parse(data);
  }
}
