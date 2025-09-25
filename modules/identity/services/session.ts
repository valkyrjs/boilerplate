import cookie from "cookie";

import { config } from "../config.ts";
import { auth } from "./auth.ts";

/**
 * Get session headers which can be applied on a Response object to apply
 * an authenticated session to the respondent.
 *
 * @param accessToken - Token to apply to the cookie.
 * @param maxAge      - Max age of the token.
 */
export async function getSessionHeaders(accessToken: string, maxAge: number): Promise<Headers> {
  return new Headers({
    "set-cookie": cookie.serialize(
      "better-auth.session_token",
      encodeURIComponent(accessToken), // URL-encode the token
      config.cookie(maxAge),
    ),
  });
}

/**
 * Get session container from request headers.
 *
 * @param headers - Request headers to extract session from.
 */
export async function getSessionByRequestHeader(headers: Headers) {
  const response = await auth.api.getSession({ headers });
  if (response === null) {
    return undefined;
  }
  return response.session;
}
