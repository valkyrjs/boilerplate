import { NotFoundError } from "@platform/relay";

import { config } from "../../../config.ts";
import { getPrincipalByUserId } from "../../../services/database.ts";
import { getSessionByRequestHeader } from "../../../services/session.ts";
import route from "./spec.ts";

export default route.access(["internal:public", config.internal.privateKey]).handle(async ({ request }) => {
  const session = await getSessionByRequestHeader(request.headers);
  if (session === undefined) {
    return new NotFoundError();
  }
  return {
    session,
    principal: await getPrincipalByUserId(session.userId),
  };
});
