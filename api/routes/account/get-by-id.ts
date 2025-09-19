import { ForbiddenError, NotFoundError } from "@platform/relay";
import { getById } from "@platform/spec/account/routes.ts";

import { db } from "~stores/read-store/database.ts";

export default getById.access("authenticated").handle(async ({ params: { id } }, { access }) => {
  const account = await db.collection("accounts").findOne({ id });
  if (account === null) {
    return new NotFoundError();
  }
  const decision = await access.isAllowed({ kind: "account", id: account.id, attributes: {} }, "read");
  if (decision === false) {
    return new ForbiddenError();
  }
  return account;
});
