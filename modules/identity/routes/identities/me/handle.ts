import { UnauthorizedError } from "@platform/relay";

import { getIdentityById } from "../../../database.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ principal }) => {
  const identity = await getIdentityById(principal.id);
  if (identity === undefined) {
    return new UnauthorizedError("You must be signed in to view your session.");
  }
  return identity;
});
