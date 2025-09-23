import { logger } from "@platform/logger";
import { NotFoundError } from "@platform/relay";
import { getSessionHeaders } from "@platform/supertoken/session.ts";
import Passwordless from "supertokens-node/recipe/passwordless";

import route from "./spec.ts";

export default route.access("public").handle(async ({ body: { email } }) => {
  const code = await Passwordless.createCode({ tenantId: "public", email });
  if (code.status !== "OK") {
    return logger.info({
      type: "auth:passwordless",
      message: "Create code failed.",
      received: email,
    });
  }

  logger.info({
    type: "auth:passwordless",
    data: {
      deviceId: code.deviceId,
      preAuthSessionId: code.preAuthSessionId,
      userInputCode: code.userInputCode,
    },
  });

  const response = await Passwordless.consumeCode({
    tenantId: "public",
    preAuthSessionId: code.preAuthSessionId,
    deviceId: code.deviceId,
    userInputCode: code.userInputCode,
  });
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
