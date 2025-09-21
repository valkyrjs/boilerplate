import { getDatabaseAccessor } from "@platform/database/accessor.ts";

import { type Identity, parseIdentity } from "./models/identity.ts";
import type { PasswordStrategy } from "./schemas/strategies.ts";

export const db = getDatabaseAccessor<{
  identities: Identity;
}>(`identity:read-store`);

/*
 |--------------------------------------------------------------------------------
 | Identity
 |--------------------------------------------------------------------------------
 */

/**
 * Retrieve a single account by its primary identifier.
 *
 * @param id - Unique identity.
 */
export async function getIdentityById(id: string): Promise<Identity | undefined> {
  return db
    .collection("identities")
    .findOne({ id })
    .then((document) => parseIdentity(document));
}

/**
 * Get strategy details for the given password strategy alias.
 *
 * @param alias - Alias to get strategy for.
 */
export async function getPasswordStrategyByAlias(
  alias: string,
): Promise<({ accountId: string } & PasswordStrategy) | undefined> {
  const account = await db.collection("identities").findOne({
    strategies: {
      $elemMatch: { type: "password", alias },
    },
  });
  if (account === null) {
    return undefined;
  }
  const strategy = account.strategies.find((strategy) => strategy.type === "password" && strategy.alias === alias);
  if (strategy === undefined) {
    return undefined;
  }
  return { accountId: account.id, ...strategy } as { accountId: string } & PasswordStrategy;
}
