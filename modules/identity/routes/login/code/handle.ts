import { logger } from "@platform/logger";
import { NotFoundError } from "@platform/relay";
import { getSessionHeaders } from "@platform/supertoken/session.ts";
import Passwordless from "supertokens-node/recipe/passwordless";

import route from "./spec.ts";

export default route.access("public").handle(async ({ body: { preAuthSessionId, deviceId, userInputCode } }) => {
  const response = await Passwordless.consumeCode({ tenantId: "public", preAuthSessionId, deviceId, userInputCode });
  if (response.status !== "OK") {
    return new NotFoundError();
  }

  logger.info({
    type: "code:claimed",
    session: true,
    message: "Identity resolved",
    user: response.user.toJson(),
  });

  return new Response(null, {
    status: 200,
    headers: await getSessionHeaders("public", response.recipeUserId),
  });
});
