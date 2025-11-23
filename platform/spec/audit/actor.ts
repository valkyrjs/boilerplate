import z from "zod";

import { AuditUserSchema, AuditUserType } from "./user.ts";

export const AuditActorSchema = z.object({
  user: AuditUserSchema,
});

export const auditors = {
  system: AuditActorSchema.parse({
    user: {
      typeId: AuditUserType.System,
    },
  }),
};

export type AuditActor = z.infer<typeof AuditActorSchema>;
