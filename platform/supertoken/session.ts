import cookie from "cookie";
import type { RecipeUserId } from "supertokens-node/index.js";
import Session from "supertokens-node/recipe/session";

import { config } from "./config.ts";

/**
 * Get session headers which can be applied on a Response object to apply
 * an authenticted session to the respondant.
 *
 * @param tenantId     - Tenant scope the session belongs to.
 * @param recipeUserId - User recipe to apply to the session.
 */
export async function getSessionHeaders(tenantId: string, recipeUserId: RecipeUserId): Promise<Headers> {
  const session = await Session.createNewSessionWithoutRequestResponse(tenantId, recipeUserId);
  const tokens = session.getAllSessionTokensDangerously();
  const options = config.cookie(await session.getExpiry());

  const headers = new Headers({ "set-cookie": cookie.serialize("sAccessToken", tokens.accessToken, options) });
  if (tokens.refreshToken !== undefined) {
    headers.append("set-cookie", cookie.serialize("sRefreshToken", tokens.refreshToken, options));
  }
  return headers;
}

/**
 * Get session container from access token.
 *
 * @param accessToken   - Access token to resolve session from.
 * @param antiCsrfToken - Optional CSRF token.
 */
export async function getSessionByAccessToken(
  accessToken: string,
  antiCsrfToken?: string,
): Promise<Session.SessionContainer> {
  return Session.getSessionWithoutRequestResponse(accessToken, antiCsrfToken);
}
