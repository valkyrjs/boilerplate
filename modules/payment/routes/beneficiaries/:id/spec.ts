import { route } from "@platform/relay";

import { BeneficiarySchema } from "../../../schemas/beneficiary.ts";

export default route
  .get("/api/v1/payment/beneficiaries/:id")
  .params({ id: BeneficiarySchema.shape._id })
  .response(BeneficiarySchema);
