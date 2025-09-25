import { ForbiddenError } from "@platform/relay";
import { NotFoundError } from "@platform/relay";

import { getPrincipalById, setPrincipalRolesById } from "../../services/database.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ params: { id }, body: ops }, { access }) => {
  const principal = await getPrincipalById(id);
  if (principal === undefined) {
    return new NotFoundError();
  }
  const decision = await access.isAllowed({ kind: "role", id: principal.id, attr: principal.attr }, "manage");
  if (decision === false) {
    return new ForbiddenError("You do not have permission to modify roles for this identity.");
  }
  const roles: Set<string> = new Set(principal.roles);
  for (const op of ops) {
    switch (op.type) {
      case "add": {
        for (const role of op.roles) {
          roles.add(role);
        }
        break;
      }
      case "remove": {
        for (const role of op.roles) {
          roles.delete(role);
        }
        break;
      }
    }
  }
  await setPrincipalRolesById(id, Array.from(roles));
});
