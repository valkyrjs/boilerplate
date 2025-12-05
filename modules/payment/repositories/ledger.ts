import { db } from "@platform/database";
import { ConflictError } from "@platform/relay";

import { type Ledger, type LedgerInsert, LedgerInsertSchema, LedgerSchema } from "../schemas/ledger.ts";

/**
 * Create a new ledger.
 *
 * @param values - Ledger values to insert.
 */
export async function createLedger(values: LedgerInsert): Promise<string> {
  return db
    .begin(async () => {
      const _id = crypto.randomUUID();
      await db.sql`ASSERT EXISTS (SELECT 1 FROM payment.beneficiary WHERE _id = ${db.text(values.beneficiaryId)}), 'missing_beneficiary'`;
      await db.sql`INSERT INTO payment.ledger RECORDS ${db.transit({ _id, ...LedgerInsertSchema.parse(values) })}`;
      return _id;
    })
    .catch((error) => {
      if (error instanceof Error && error.message === "missing_beneficiary") {
        throw new ConflictError(`Benficiary '${values.beneficiaryId}' does not exist`);
      }
      throw error;
    });
}

export async function getLedgersByBeneficiary(beneficiaryId: string): Promise<Ledger[]> {
  console.log(
    await db.sql`
    SELECT
      *, _system_from as "createdAt"
    FROM 
      payment.ledger 
    WHERE 
      "beneficiaryId" = ${beneficiaryId}
  `,
  );
  return db.schema(LedgerSchema).many`
    SELECT
      *, _system_from as "createdAt"
    FROM 
      payment.ledger 
    WHERE 
      "beneficiaryId" = ${beneficiaryId}
  `;
}

export async function getLedgerById(id: string): Promise<Ledger | undefined> {
  return db.schema(LedgerSchema).one`
    SELECT
      *, _system_from as "createdAt"
    FROM
      payment.ledger
    WHERE
      _id = ${id}
  `;
}
