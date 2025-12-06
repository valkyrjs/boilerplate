import z from "zod";

/*
 |--------------------------------------------------------------------------------
 | Tenant
 |--------------------------------------------------------------------------------
 */

export const TenantSchema = z.strictObject({
  _id: z.uuid().describe("Primary identifier of the account"),
  name: z.string().describe("Human-readable name for the tenant"),
});

export type Tenant = z.output<typeof TenantSchema>;

/*
 |--------------------------------------------------------------------------------
 | Database
 |--------------------------------------------------------------------------------
 */

export const TenantInsertSchema = z.strictObject({
  name: TenantSchema.shape.name,
});

export type TenantInsert = z.input<typeof TenantInsertSchema>;
