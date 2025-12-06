import { nestMany } from "@platform/parse";
import { route } from "@platform/relay";
import z from "zod";

import { BeneficiarySchema } from "../../schemas/beneficiary.ts";
import { LedgerSchema } from "../../schemas/ledger.ts";

export const DashboardSchema = z.strictObject({
  ...BeneficiarySchema.shape,
  ledgers: nestMany(LedgerSchema),
});

export default route
  .get("/api/v1/payment/dashboard/:id")
  .params({ id: BeneficiarySchema.shape.tenantId })
  .response(z.array(DashboardSchema));
