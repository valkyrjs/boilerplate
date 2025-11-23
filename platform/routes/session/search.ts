import { route } from "@platform/relay";
import z from "zod";

export default route.post("/api/v1/sessions/search").query({
  offset: z.number().min(0).default(0),
  limit: z.number().min(10).max(100).default(100),
  asc: z.boolean().default(true),
});
