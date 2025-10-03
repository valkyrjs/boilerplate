import { route } from "@platform/relay";
import z from "zod";

import { PrincipalSchema } from "../../../models/principal.ts";
import { SessionSchema } from "../../../models/session.ts";

export default route.get("/api/v1/identity/session").response(
  z.object({
    session: SessionSchema,
    principal: PrincipalSchema,
  }),
);
