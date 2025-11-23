import { route } from "@platform/relay";
import z from "zod";

export default route.post("/api/v1/account").body(
  z.strictObject({
    tenantId: z.uuid().describe("Tenant identifier the account belongs to"),
    userId: z.uuid().describe("User identifier the account belongs to"),
    account: z.strictObject({
      type: z.string().describe("Type of account being created"),
      number: z.number().describe("Unique account identifier to create for the account"),
    }),
  }),
);
