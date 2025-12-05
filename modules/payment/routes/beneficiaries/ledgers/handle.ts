import { getLedgersByBeneficiary } from "../../../repositories/ledger.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ params: { id } }) => getLedgersByBeneficiary(id));
