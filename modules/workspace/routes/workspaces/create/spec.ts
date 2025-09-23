import { ForbiddenError, InternalServerError, route, UnauthorizedError, ValidationError } from "@platform/relay";
import z from "zod";

import { WorkspaceSchema } from "../../../models/workspace.ts";

export default route
  .post("/api/v1/workspace")
  .body(
    z.strictObject({
      name: z.string(),
    }),
  )
  .errors([UnauthorizedError, ForbiddenError, ValidationError, InternalServerError])
  .response(WorkspaceSchema);
