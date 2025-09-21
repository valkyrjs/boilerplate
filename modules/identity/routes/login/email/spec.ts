import { route } from "@platform/relay";
import z from "zod";

export default route.post("/api/v1/identities/login/email").body(
  z.object({
    base: z.url(),
    email: z.email(),
  }),
);
