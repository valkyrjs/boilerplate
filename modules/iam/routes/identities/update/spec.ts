import { ForbiddenError, NotFoundError, route, UnauthorizedError } from "@platform/relay";
import z from "zod";

export default route
  .put("/api/v1/identity/:id")
  .params({
    id: z.string(),
  })
  .body(
    z.array(
      z.union([
        z.strictObject({
          type: z.union([z.literal("add")]),
          key: z.string(),
          value: z.any(),
        }),
        z.strictObject({
          type: z.union([z.literal("push"), z.literal("pop")]),
          key: z.string(),
          values: z.array(z.any()),
        }),
        z.strictObject({
          type: z.union([z.literal("remove")]),
          key: z.string(),
        }),
      ]),
    ),
  )
  .errors([UnauthorizedError, ForbiddenError, NotFoundError]);
