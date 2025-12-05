import { db } from "@platform/database";
import { ConflictError } from "@platform/relay";

import {
  type Beneficiary,
  type BeneficiaryInsert,
  BeneficiaryInsertSchema,
  BeneficiarySchema,
  type BeneficiaryUpdate,
  BeneficiaryUpdateSchema,
} from "../schemas/beneficiary.ts";

/**
 * Create a new beneficiary entity.
 *
 * @param values - Beneficiary values to insert.
 */
export async function createBeneficiary({ tenantId, label }: BeneficiaryInsert): Promise<string> {
  return db
    .begin(async () => {
      const _id = crypto.randomUUID();
      await db.sql`ASSERT NOT EXISTS (SELECT 1 FROM payment.beneficiary WHERE "tenantId" = ${db.text(tenantId)}), 'duplicate_tenant'`;
      await db.sql`INSERT INTO payment.beneficiary RECORDS ${db.transit({ _id, ...BeneficiaryInsertSchema.parse({ tenantId, label }) })}`;
      return _id;
    })
    .catch((error) => {
      if (error instanceof Error && error.message === "duplicate_tenant") {
        throw new ConflictError(`Tenant '${tenantId}' already has a beneficiary`);
      }
      throw error;
    });
}

/**
 * Get a list of all registered beneficiaries.
 */
export async function getBeneficiaries(): Promise<any[]> {
  return db.schema(BeneficiarySchema).many`
    SELECT
      *, _system_from as "createdAt"
    FROM 
      payment.beneficiary
    ORDER BY
      _system_from DESC
  `;
}

/**
 * Get a beneficiary entity by provided tenant id.
 *
 * @param tenantId - Tenant we want to retrieve benificiary for.
 */
export async function getBeneficiaryByTenantId(tenantId: string): Promise<Beneficiary | undefined> {
  return db.schema(BeneficiarySchema).one`
    SELECT
      *, _system_from as "createdAt"
    FROM 
      payment.beneficiary
    WHERE
      "tenantId" = ${tenantId}
    ORDER BY
      _system_from DESC
  `;
}

/**
 * Get a beneficiary entity by provided id.
 *
 * @param id - Identity of the beneficiary to retrieve.
 */
export async function getBeneficiaryById(id: string): Promise<Beneficiary | undefined> {
  return db.schema(BeneficiarySchema).one`
    SELECT
      *, _system_from as "createdAt"
    FROM 
      payment.beneficiary
    WHERE
      _id = ${id}
    ORDER BY
      _system_from DESC
  `;
}

/**
 * Update a beneficiary entity with the given data.
 *
 * @param attributes - Attributes to set on the beneficiary.
 */
export async function updateBeneficiary(attributes: BeneficiaryUpdate): Promise<void> {
  const { _id, label } = BeneficiaryUpdateSchema.parse(attributes);
  await db.sql`UPDATE payment.beneficiary SET label = ${label} WHERE _id = ${_id}`;
}

/**
 * Delete a beneficiary entity.
 *
 * @param id - Identity of the beneficiary to delete.
 */
export async function deleteBeneficiary(id: string): Promise<void> {
  await db.sql`DELETE FROM payment.beneficiary WHERE _id = ${id}`;
}
