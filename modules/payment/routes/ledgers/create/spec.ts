import { route } from "@platform/relay";
import z from "zod";

import { LedgerInsertSchema } from "../../../schemas/ledger.ts";

export default route.post("/api/v1/payment/ledgers").body(LedgerInsertSchema).response(z.uuid());
