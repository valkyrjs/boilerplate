import { NotFoundError } from "@platform/relay";

import { auth } from "../../../services/auth.ts";
import { logger } from "../../../services/logger.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body: { email, otp } }) => {
  const response = await auth.api.signInEmailOTP({ body: { email, otp }, asResponse: true, returnHeaders: true });
  if (response.status !== 200) {
    logger.error("OTP Signin Failed", await response.json());
    return new NotFoundError();
  }
  return new Response(null, {
    headers: response.headers,
  });
});
