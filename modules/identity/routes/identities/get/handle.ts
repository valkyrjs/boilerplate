import { ForbiddenError, NotFoundError } from "@platform/relay";
import { getPrincipalAttributes, getPrincipalRoles } from "@platform/supertoken/principal.ts";
import { getUserById } from "@platform/supertoken/users.ts";

import route from "./spec.ts";

export default route.access("session").handle(async ({ params: { id } }, { access }) => {
  const user = await getUserById(id);
  if (user === undefined) {
    return new NotFoundError("Identity does not exist, or has been removed.");
  }
  const decision = await access.isAllowed({ kind: "identity", id: user.id, attr: {} }, "read");
  if (decision === false) {
    return new ForbiddenError("You do not have permission to view this identity.");
  }
  return {
    id: user.id,
    roles: await getPrincipalRoles(id),
    attr: await getPrincipalAttributes(id),
  };
});
