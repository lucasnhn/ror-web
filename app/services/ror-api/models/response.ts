import { z } from "zod";

/**
 * A generic response type for the ROR API
 *
 * @interal
 * @param dataType - The Zod schema for the data field
 * @returns A Zod schema for the ROR API response
 */
export const RorApiResponse = <T extends z.ZodType>(dataType: T) =>
  z.object({
    data: dataType,
    status: z.number(),
  });
