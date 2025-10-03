import { route } from "@platform/relay";
import z from "zod";

export default route.post("/api/v1/identity/login/email").body(
  z.object({
    email: z.email(),
  }),
);
