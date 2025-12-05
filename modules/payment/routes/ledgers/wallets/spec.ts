import { route } from "@platform/relay";
import z from "zod";

import { WalletSchema } from "../../../schemas/wallet.ts";

export default route
  .get("/api/v1/payment/ledgers/:id/wallets")
  .params({ id: z.uuid() })
  .response(z.array(WalletSchema));
