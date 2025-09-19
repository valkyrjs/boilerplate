import { RoleSchema } from "@spec/schemas/account/role.ts";
import { PrincipalProvider } from "@valkyr/auth";

import { db } from "~stores/read-store/database.ts";

export const principal = new PrincipalProvider(RoleSchema, {}, async function (id: string) {
  const account = await db.collection("accounts").findOne({ id });
  if (account === null) {
    return undefined;
  }
  return {
    id,
    roles: account.roles,
    attributes: {},
  };
});

export type Principal = typeof principal.$principal;
