import { logger } from "@platform/logger";

import { Code } from "../../../aggregates/code.ts";
import { getIdentityEmailRelation, Identity } from "../../../aggregates/identity.ts";
import { eventStore } from "../../../event-store.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body: { base, email } }) => {
  const identity = await eventStore.aggregate.getByRelation(Identity, getIdentityEmailRelation(email));
  if (identity === undefined) {
    return logger.info({
      type: "auth:email",
      code: false,
      message: "Identity Not Found",
      received: email,
    });
  }
  const code = await eventStore.aggregate.from(Code).create({ id: identity.id }).save();
  logger.info({
    type: "auth:email",
    data: {
      code: code.id,
      identityId: identity.id,
    },
    link: `${base}/api/v1/admin/auth/${identity.id}/code/${code.id}/${code.value}?next=${base}/admin`,
  });
});
