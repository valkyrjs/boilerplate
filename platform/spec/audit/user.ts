import z from "zod";

export enum AuditUserType {
  Unknown = 0,
  Identity = 1,
  System = 2,
  Service = 3,
  Other = 99,
}

export const AuditUserSchema = z.object({
  typeId: z.enum(AuditUserType).describe("The account type identifier."),
  uid: z
    .string()
    .optional()
    .describe("The unique user identifier. For example, the Windows user SID, ActiveDirectory DN or AWS user ARN."),
});
