import type { z } from "zod";
import type { UserSelf } from "./users.model";
import { createResource, type ResourceClient } from "../create-resource";

export interface UsersResource {
  self: () => Promise<z.infer<typeof UserSelf>>;
}

export const createUsersResource = (client: ResourceClient): UsersResource => {
  const resource = createResource(client);

  return {
    self: () => resource.get("/v2/self"),
  };
};
