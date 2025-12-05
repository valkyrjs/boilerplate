import { createBeneficiary } from "../../../repositories/beneficiary.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body }) => createBeneficiary(body));
