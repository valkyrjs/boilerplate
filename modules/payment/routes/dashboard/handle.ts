import { db } from "@platform/database";

import route, { DashboardSchema } from "./spec.ts";

export default route.access("public").handle(async ({ params: { id: tenantId } }) => {
  return db.schema(DashboardSchema).many`
    SELECT
      pb.*,
      pb._system_from AS "createdAt",
      COALESCE(
        NEST_MANY(
          SELECT 
            pl.*,
            pl._system_from AS "createdAt"
          FROM 
            payment.ledger pl
          WHERE 
            pl."beneficiaryId" = pb._id
          ORDER BY 
            pl._id
        ),
        [] -- default to empty array
      ) AS ledgers
    FROM
      payment.beneficiary pb
    WHERE 
      pb."tenantId" = ${tenantId}
  `;
});
