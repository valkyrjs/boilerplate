import { ForbiddenError, NotFoundError } from "@platform/relay";

import { getIdentityById } from "../../../database.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ params: { id } }, { access }) => {
  const identity = await getIdentityById(id);
  if (identity === undefined) {
    return new NotFoundError("Identity does not exist, or has been removed.");
  }
  const decision = await access.isAllowed({ kind: "identity", id: identity.id, attr: {} }, "read");
  if (decision === false) {
    return new ForbiddenError("You do not have permission to view this identity.");
  }
  return identity;
});
