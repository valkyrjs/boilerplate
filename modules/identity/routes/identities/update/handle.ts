import { ForbiddenError } from "@platform/relay";
import { getPrincipalAttributes } from "@platform/supertoken/principal.ts";
import UserMetadata from "supertokens-node/recipe/usermetadata";

import route from "./spec.ts";

export default route.access("session").handle(async ({ params: { id }, body: ops }, { access }) => {
  const decision = await access.isAllowed({ kind: "identity", id, attr: {} }, "update");
  if (decision === false) {
    return new ForbiddenError("You do not have permission to update this identity.");
  }
  const attr = await getPrincipalAttributes(id);
  for (const op of ops) {
    switch (op.type) {
      case "add": {
        attr[op.key] = op.value;
        break;
      }
      case "push": {
        if (attr[op.key] === undefined) {
          attr[op.key] = op.values;
        } else {
          attr[op.key] = [...attr[op.key], ...op.values];
        }
        break;
      }
      case "pop": {
        if (Array.isArray(attr[op.key])) {
          attr[op.key] = attr[op.key].filter((value: any) => op.values.includes(value) === false);
        }
        break;
      }
      case "remove": {
        delete attr[op.key];
        break;
      }
    }
  }
  await UserMetadata.updateUserMetadata(id, { attr });
});
