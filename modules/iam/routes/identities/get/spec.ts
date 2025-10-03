import { ForbiddenError, NotFoundError, route, UnauthorizedError } from "@platform/relay";
import z from "zod";

export default route
  .get("/api/v1/identity/:id")
  .params({
    id: z.string(),
  })
  .errors([UnauthorizedError, ForbiddenError, NotFoundError])
  .response(z.any());
