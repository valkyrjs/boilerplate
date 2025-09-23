import { logger } from "@platform/logger";
import Passwordless from "supertokens-node/recipe/passwordless";

import route from "./spec.ts";

export default route.access("public").handle(async ({ body: { email } }) => {
  const response = await Passwordless.createCode({ tenantId: "public", email });
  if (response.status !== "OK") {
    return logger.info({
      type: "auth:passwordless",
      message: "Create code failed.",
      received: email,
    });
  }
  logger.info({
    type: "auth:passwordless",
    data: {
      deviceId: response.deviceId,
      preAuthSessionId: response.preAuthSessionId,
      userInputCode: response.userInputCode,
    },
  });
});
