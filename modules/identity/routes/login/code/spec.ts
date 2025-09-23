import { route } from "@platform/relay";
import z from "zod";

export default route
  .post("/api/v1/identity/login/code")
  .body(
    z.strictObject({
      deviceId: z.string(),
      preAuthSessionId: z.string(),
      userInputCode: z.string(),
    }),
  )
  .query({
    next: z.string().optional(),
  });
