import { NotFoundError, route, UnauthorizedError } from "@platform/relay";
import z from "zod";

import { IdentitySchema } from "../../../models/identity.ts";

export default route
  .get("/api/v1/identities/:id/resolve")
  .params({
    id: z.string(),
  })
  .response(IdentitySchema)
  .errors([UnauthorizedError, NotFoundError]);
