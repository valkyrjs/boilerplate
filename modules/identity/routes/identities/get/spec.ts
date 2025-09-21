import { ForbiddenError, NotFoundError, route, UnauthorizedError } from "@platform/relay";
import z from "zod";

import { IdentitySchema } from "../../../models/identity.ts";

export default route
  .get("/api/v1/identities/:id")
  .params({
    id: z.string(),
  })
  .errors([UnauthorizedError, ForbiddenError, NotFoundError])
  .response(IdentitySchema);
