import { route } from "@platform/relay";
import z from "zod";

import { LedgerSchema } from "../../../schemas/ledger.ts";

export default route
  .get("/api/v1/payment/beneficiaries/:id/ledgers")
  .params({ id: z.uuid() })
  .response(z.array(LedgerSchema));
