import { EmailSchema } from "@platform/models/value-objects/email.ts";
import { NameSchema } from "@platform/models/value-objects/name.ts";
import { RoleSchema } from "@platform/spec/account/role.ts";
import { event } from "@valkyr/event-store";
import z from "zod";

import { AuditorSchema } from "./auditor.ts";

export default [
  event.type("account:created").meta(AuditorSchema),
  event.type("account:avatar:added").data(z.string()).meta(AuditorSchema),
  event.type("account:name:added").data(NameSchema).meta(AuditorSchema),
  event.type("account:email:added").data(EmailSchema).meta(AuditorSchema),
  event.type("account:role:added").data(RoleSchema).meta(AuditorSchema),
];
