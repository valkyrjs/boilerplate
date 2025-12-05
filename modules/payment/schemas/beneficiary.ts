import z from "zod";

/*
 |--------------------------------------------------------------------------------
 | Beneficiary
 |--------------------------------------------------------------------------------
 |
 | A beneficiary is an entity (person, organization, or system) that owns one or
 | more ledgers. All financial activity is scoped under the beneficiary.
 |
 */

export const BeneficiarySchema = z.strictObject({
  _id: z.uuid().describe("Primary identifier of the beneficiary"),
  tenantId: z.string().describe("Identifier of the tenant this beneficiary belongs to"),
  label: z.string().optional().describe("Human-readable name for the beneficiary"),
  createdAt: z.coerce.date().describe("Timestamp when the beneficiary was created"),
});

export type Beneficiary = z.output<typeof BeneficiarySchema>;

/*
 |--------------------------------------------------------------------------------
 | Database
 |--------------------------------------------------------------------------------
 */

export const BeneficiaryInsertSchema = z.strictObject({
  tenantId: BeneficiarySchema.shape.tenantId,
  label: z.string().nullable().default(null).describe("Human-readable name for the beneficiary"),
});

export type BeneficiaryInsert = z.input<typeof BeneficiaryInsertSchema>;

export const BeneficiaryUpdateSchema = z.strictObject({
  _id: z.uuid().describe("Primary identifier of the beneficiary"),
  label: z.string().nullable().default(null).describe("Human-readable name for the beneficiary"),
});

export type BeneficiaryUpdate = z.input<typeof BeneficiaryUpdateSchema>;
