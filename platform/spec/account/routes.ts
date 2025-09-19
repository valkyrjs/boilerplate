import { AccountSchema } from "@platform/models/account.ts";
import { NameSchema } from "@platform/models/value-objects/name.ts";
import { ForbiddenError, NotFoundError, route, UnauthorizedError } from "@platform/relay";
import z from "zod";

import { AccountEmailClaimedError } from "./errors.ts";

export const create = route
  .post("/api/v1/accounts")
  .body(
    z.object({
      name: NameSchema,
      email: z.email(),
    }),
  )
  .errors([AccountEmailClaimedError])
  .response(z.uuid());

export const getById = route
  .get("/api/v1/accounts/:id")
  .params({
    id: z.string(),
  })
  .errors([UnauthorizedError, ForbiddenError, NotFoundError])
  .response(AccountSchema);

export const routes = {
  create,
  getById,
};
