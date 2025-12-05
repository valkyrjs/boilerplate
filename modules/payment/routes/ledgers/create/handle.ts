import { createLedger } from "../../../repositories/ledger.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body }) => createLedger(body));
