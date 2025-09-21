import { route } from "@platform/relay";
import z from "zod";

export default route
  .get("/api/v1/identities/login/code/:identityId/code/:codeId/:value")
  .params({
    identityId: z.string(),
    codeId: z.string(),
    value: z.string(),
  })
  .query({
    next: z.string().optional(),
  });
