import { createWallet } from "../../../repositories/wallet.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body }) => createWallet(body));
