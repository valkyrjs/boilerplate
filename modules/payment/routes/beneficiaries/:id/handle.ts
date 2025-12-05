import { NotFoundError } from "@platform/relay";

import { getBeneficiaryById } from "../../../repositories/beneficiary.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ params: { id } }) => {
  const beneficiary = await getBeneficiaryById(id);
  if (beneficiary === undefined) {
    return new NotFoundError();
  }
  return beneficiary;
});
