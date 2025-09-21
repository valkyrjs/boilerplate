import { route } from "@platform/relay";
import z from "zod";

import { IdentityEmailClaimedError } from "../../../errors.ts";
import { IdentitySchema } from "../../../models/identity.ts";
import { NameSchema } from "../../../schemas/name.ts";

export default route
  .post("/api/v1/identities")
  .body(
    z.object({
      name: NameSchema,
      email: z.email(),
    }),
  )
  .errors([IdentityEmailClaimedError])
  .response(IdentitySchema);
