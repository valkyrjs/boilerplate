import { AuditActorSchema } from "@platform/spec/audit/actor.ts";
import { event } from "@valkyr/event-store";
import z from "zod";

export default [
  event
    .type("workspace:created")
    .data(
      z.strictObject({
        ownerId: z.uuid(),
        name: z.string(),
      }),
    )
    .meta(AuditActorSchema),
  event.type("workspace:name:added").data(z.string()).meta(AuditActorSchema),
  event.type("workspace:description:added").data(z.string()).meta(AuditActorSchema),
  event.type("workspace:archived").meta(AuditActorSchema),
  event.type("workspace:restored").meta(AuditActorSchema),
];
