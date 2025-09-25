import { ForbiddenError, NotFoundError } from "@platform/relay";

import { getPrincipalById, setPrincipalAttributesById } from "../../../services/database.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ params: { id }, body: ops }, { access }) => {
  const principal = await getPrincipalById(id);
  if (principal === undefined) {
    return new NotFoundError();
  }
  const decision = await access.isAllowed({ kind: "identity", id: principal.id, attr: principal.attr }, "update");
  if (decision === false) {
    return new ForbiddenError("You do not have permission to update this identity.");
  }
  const attr = principal.attr;
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
  await setPrincipalAttributesById(id, attr);
});
