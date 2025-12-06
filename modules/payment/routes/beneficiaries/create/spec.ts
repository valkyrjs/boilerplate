import { route } from "@platform/relay";
import z from "zod";

import { BeneficiaryInsertSchema } from "../../../schemas/beneficiary.ts";

export default route.post("/api/v1/payment/beneficiaries").body(BeneficiaryInsertSchema).response(z.uuid());
