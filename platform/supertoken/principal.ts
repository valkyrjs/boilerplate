import UserMetadata from "supertokens-node/recipe/usermetadata";
import z from "zod";

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const PrincipalSchema = z.object({
  id: z.string(),
  roles: z.array(z.string()),
  attr: z.record(z.string(), z.any()),
});

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Get principal roles from the provided userId.
 *
 * @param userId - User to get principal roles from.
 */
export async function getPrincipalRoles(userId: string): Promise<string[]> {
  return (await UserMetadata.getUserMetadata(userId)).metadata?.roles ?? [];
}

/**
 * Get principal attributes from the provided userId.
 *
 * @param userId - User to get principal attributes from.
 */
export async function getPrincipalAttributes(userId: string): Promise<Record<string, any>> {
  return (await UserMetadata.getUserMetadata(userId)).metadata?.attr ?? {};
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Principal = z.infer<typeof PrincipalSchema>;
