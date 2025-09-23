import { ForbiddenError, NotFoundError, route, UnauthorizedError } from "@platform/relay";
import z from "zod";

export default route
  .put("/api/v1/identity/:id/roles")
  .params({
    id: z.string(),
  })
  .body(
    z.array(
      z.union([
        z.strictObject({
          type: z.union([z.literal("add"), z.literal("remove")]),
          roles: z.array(z.any()),
        }),
      ]),
    ),
  )
  .errors([UnauthorizedError, ForbiddenError, NotFoundError]);
