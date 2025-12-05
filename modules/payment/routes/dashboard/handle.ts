import { db } from "@platform/database";
import { NotFoundError } from "@platform/relay";

import route, { DashboardSchema } from "./spec.ts";

export default route.access("public").handle(async ({ params: { id } }) => {
  const dashboard = await db.schema(DashboardSchema).one`
    SELECT
      pb.*,
      pb._system_from AS "createdAt",
      NEST_MANY(
        SELECT 
          pl.*,
          pl._system_from AS "createdAt",
        FROM 
          payment.ledger pl
        WHERE 
          pl."beneficiaryId" = pb._id
        ORDER BY 
          pl._id
      ) AS ledgers
    FROM
      payment.beneficiary pb
    WHERE 
      pb._id = ${id}
  `;
  if (dashboard === undefined) {
    return new NotFoundError("Beneficiary not found");
  }
  return dashboard;
});
