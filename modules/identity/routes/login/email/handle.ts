import { auth } from "../../../services/auth.ts";
import { logger } from "../../../services/logger.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body: { email } }) => {
  const response = await auth.api.sendVerificationOTP({ body: { email, type: "sign-in" } });
  if (response.success === false) {
    logger.info({
      type: "auth:passwordless",
      message: "OTP Email verification failed.",
      received: email,
    });
  }
});
