import { route } from "@platform/relay";
import z from "zod";

import { BeneficiarySchema } from "../../../schemas/beneficiary.ts";

export default route.get("/api/v1/payment/beneficiaries").response(z.array(BeneficiarySchema));
