import { route } from "@platform/relay";
import z from "zod";

export default route
  .post("/api/v1/identity/access/check-resource")
  .body(
    z.strictObject({
      resource: z.strictObject({
        kind: z.string(),
        id: z.string(),
        attr: z.record(z.string(), z.any()),
      }),
      actions: z.array(z.string()),
    }),
  )
  .response(z.any());
