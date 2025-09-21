import { route } from "@platform/relay";
import z from "zod";

export default route.post("/api/v1/identities/login/password").body(
  z.object({
    alias: z.string(),
    password: z.string(),
  }),
);
