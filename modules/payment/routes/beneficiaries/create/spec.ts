import { route } from "@platform/relay";

import { BeneficiaryInsertSchema, BeneficiarySchema } from "../../../schemas/beneficiary.ts";

export default route.post("/api/v1/payment/beneficiaries").body(BeneficiaryInsertSchema).response(BeneficiarySchema);
