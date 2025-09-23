import { route } from "@platform/relay";
import z from "zod";

export default route.post("/api/v1/identities/login/sudo").body(
  z.object({
    email: z.email(),
  }),
);
