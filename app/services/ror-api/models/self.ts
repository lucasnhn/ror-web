import { z } from "zod";
import { RorApiResponse } from "./response";

export const SelfApiResponse = RorApiResponse(
  z.object({
    auth: z.object({
      authProvider: z.string(),
      authProviderId: z.string(),
      expirationTime: z.string(),
    }),
    type: z.string(),
    user: z.object({
      name: z.string(),
      email: z.string(),
      groups: z.array(z.string()),
    }),
  })
);
