import { UnauthorizedError } from "@spec/relay/mod.ts";
import { session } from "@spec/schemas/auth/routes.ts";

import { getAccountById } from "~stores/read-store/methods.ts";

export default session.access("authenticated").handle(async ({ principal }) => {
  const account = await getAccountById(principal.id);
  if (account === undefined) {
    return new UnauthorizedError();
  }
  return account;
});
