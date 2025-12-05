import { route } from "@platform/relay";
import z from "zod";

import { AccountInsertSchema } from "../../../schemas/account.ts";

export default route.post("/api/v1/payment/accounts").body(AccountInsertSchema).response(z.uuid());
