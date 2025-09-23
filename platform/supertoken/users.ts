import supertokens, { type User } from "supertokens-node";

/**
 * Get a user by provided user id.
 *
 * @param userId - User id to retrieve.
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  return supertokens.getUser(userId);
}
