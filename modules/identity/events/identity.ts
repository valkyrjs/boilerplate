import { AuditActorSchema } from "@platform/spec/audit/actor.ts";
import { event } from "@valkyr/event-store";
import z from "zod";

import { EmailSchema } from "../schemas/email.ts";
import { NameSchema } from "../schemas/name.ts";
import { RoleSchema } from "../schemas/role.ts";

export default [
  event.type("identity:created").meta(AuditActorSchema),
  event.type("identity:avatar:added").data(z.string()).meta(AuditActorSchema),
  event.type("identity:name:added").data(NameSchema).meta(AuditActorSchema),
  event.type("identity:email:added").data(EmailSchema).meta(AuditActorSchema),
  event.type("identity:role:added").data(RoleSchema).meta(AuditActorSchema),
  event.type("identity:strategy:email:added").data(z.string()).meta(AuditActorSchema),
  event.type("identity:strategy:passkey:added").meta(AuditActorSchema),
  event
    .type("identity:strategy:password:added")
    .data(z.object({ alias: z.string(), password: z.string() }))
    .meta(AuditActorSchema),
];
