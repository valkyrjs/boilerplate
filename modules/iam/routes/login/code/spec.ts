import { route } from "@platform/relay";
import z from "zod";

export default route
  .post("/api/v1/identity/login/code")
  .body(
    z.strictObject({
      email: z.string(),
      otp: z.string(),
    }),
  )
  .query({
    next: z.string().optional(),
  });
