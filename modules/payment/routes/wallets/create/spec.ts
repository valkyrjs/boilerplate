import { route } from "@platform/relay";
import z from "zod";

import { WalletInsertSchema } from "../../../schemas/wallet.ts";

export default route.post("/api/v1/payment/wallets").body(WalletInsertSchema).response(z.uuid());
