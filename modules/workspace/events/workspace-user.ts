import { AuditActorSchema } from "@platform/spec/audit/actor.ts";
import { event } from "@valkyr/event-store";
import z from "zod";

import { AvatarSchema } from "../value-objects/avatar.ts";
import { ContactSchema } from "../value-objects/contact.ts";
import { NameSchema } from "../value-objects/name.ts";

export default [
  event
    .type("workspace:user:created")
    .data(
      z.strictObject({
        workspaceId: z.string(),
        identityId: z.string(),
      }),
    )
    .meta(AuditActorSchema),
  event.type("workspace:user:name-set").data(NameSchema).meta(AuditActorSchema),
  event.type("workspace:user:avatar-set").data(AvatarSchema).meta(AuditActorSchema),
  event.type("workspace:user:contacts-added").data(z.array(ContactSchema)).meta(AuditActorSchema),
  event.type("workspace:user:contacts-removed").data(z.array(z.string())).meta(AuditActorSchema),
];
