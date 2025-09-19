import { ForbiddenError, NotFoundError, route, UnauthorizedError } from "@spec/relay";
import z from "zod";

import { NameSchema } from "../name.ts";
import { AccountSchema } from "./account.ts";
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
