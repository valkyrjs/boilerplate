import { createAccount } from "../../../repositories/account.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body }) => createAccount(body));
