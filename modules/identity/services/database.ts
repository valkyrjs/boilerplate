import { getDatabaseAccessor } from "@platform/database/accessor.ts";

import {
  parsePrincipal,
  type Principal,
  PRINCIPAL_TYPE_NAMES,
  PrincipalSchema,
  PrincipalTypeId,
} from "../models/principal.ts";

export const db = getDatabaseAccessor<{
  principal: Principal;
}>("auth");

/*
 |--------------------------------------------------------------------------------
 | Methods
 |--------------------------------------------------------------------------------
 */

export async function getPrincipalById(id: string): Promise<Principal | undefined> {
  return db
    .collection("principal")
    .findOne({ id })
    .then((value) => parsePrincipal(value));
}

export async function setPrincipalRolesById(id: string, roles: string[]): Promise<void> {
  await db.collection("principal").updateOne({ id }, { $set: { roles } });
}

export async function setPrincipalAttributesById(id: string, attr: Record<string, any>): Promise<void> {
  await db.collection("principal").updateOne({ id }, { $set: { attr } });
}

/**
 * Retrieve a principal for a better-auth user.
 *
 * @param userId - User id from better-auth user list.
 */
export async function getPrincipalByUserId(userId: string): Promise<Principal> {
  const principal = await db.collection("principal").findOneAndUpdate(
    { id: userId },
    {
      $setOnInsert: {
        id: userId,
        type: {
          id: PrincipalTypeId.User,
          name: PRINCIPAL_TYPE_NAMES[PrincipalTypeId.User],
        },
        roles: ["user"],
        attr: {},
      },
    },
    { upsert: true, returnDocument: "after" },
  );
  if (principal === null) {
    throw new Error("Failed to resolve Principal");
  }
  return PrincipalSchema.parse(principal);
}
