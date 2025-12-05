import { getAccountsByWalletId } from "../../../repositories/account.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ params: { id } }) => getAccountsByWalletId(id));
