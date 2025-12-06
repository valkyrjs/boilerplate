import { db } from "@platform/database";
import { BadRequestError } from "@platform/relay";

import { type Ledger, type LedgerInsert, LedgerSchema } from "../schemas/ledger.ts";

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
      await db.sql`
        INSERT INTO payment.ledger (
          _id,
          "beneficiaryId",
          currencies,
          label
        ) VALUES (
          ${db.text(_id)},
          ${db.text(values.beneficiaryId)},
          ${db.array(values.currencies)},
          ${values.label ? db.text(values.label) : null}
        )
      `;
      return _id;
    })
    .catch((error) => {
      if (error instanceof Error && error.message === "missing_beneficiary") {
        throw new BadRequestError(`Benficiary '${values.beneficiaryId}' does not exist`, {
          input: "beneficiary",
        });
      }
      throw error;
    });
}

export async function getLedgersByBeneficiary(beneficiaryId: string): Promise<Ledger[]> {
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
      *, _system_from as "created_at"
    FROM
      payment.ledger
    WHERE
      _id = ${id}
  `;
}
