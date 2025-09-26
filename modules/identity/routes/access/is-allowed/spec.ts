import { route } from "@platform/relay";
import z from "zod";

export default route
  .post("/api/v1/identity/access/is-allowed")
  .body(
    z.strictObject({
      resource: z.strictObject({
        kind: z.string(),
        id: z.string(),
        attr: z.record(z.string(), z.any()),
      }),
      action: z.string(),
    }),
  )
  .response(z.boolean());
