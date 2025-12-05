import { route } from "@platform/relay";
import z from "zod";

import { AccountSchema } from "../../../schemas/account.ts";

export default route
  .get("/api/v1/payment/wallets/:id/accounts")
  .params({ id: z.uuid() })
  .response(z.array(AccountSchema));
