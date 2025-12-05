import { getWalletsByLedgerId } from "../../../repositories/wallet.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ params: { id } }) => getWalletsByLedgerId(id));
