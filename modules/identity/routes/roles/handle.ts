import { ForbiddenError } from "@platform/relay";
import { getPrincipalRoles } from "@platform/supertoken/principal.ts";
import UserMetadata from "supertokens-node/recipe/usermetadata";

import route from "./spec.ts";

export default route.access("session").handle(async ({ params: { id }, body: ops }, { access }) => {
  const decision = await access.isAllowed({ kind: "role", id, attr: {} }, "manage");
  if (decision === false) {
    return new ForbiddenError("You do not have permission to modify roles for this identity.");
  }
  const roles: Set<string> = new Set(await getPrincipalRoles(id));
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
  await UserMetadata.updateUserMetadata(id, { roles: Array.from(roles) });
});
