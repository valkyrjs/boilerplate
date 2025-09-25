import { type AuditActor, auditors } from "@platform/spec/audit/actor.ts";
import { AggregateRoot, getDate } from "@valkyr/event-store";

import { db } from "../database.ts";
import { type EventRecord, type EventStoreFactory, projector } from "../event-store.ts";

export class WorkspaceUser extends AggregateRoot<EventStoreFactory> {
  static override readonly name = "workspace:user";

  workspaceId!: string;
  identityId!: string;

  createdAt!: Date;
  updatedAt?: Date;

  // -------------------------------------------------------------------------
  // Reducer
  // -------------------------------------------------------------------------

  with(event: EventRecord): void {
    switch (event.type) {
      case "workspace:user:created": {
        this.workspaceId = event.data.workspaceId;
        this.identityId = event.data.identityId;
        break;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  create(workspaceId: string, identityId: string, meta: AuditActor = auditors.system) {
    return this.push({
      stream: this.id,
      type: "workspace:user:created",
      data: {
        workspaceId,
        identityId,
      },
      meta,
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Projectors
 |--------------------------------------------------------------------------------
 */

projector.on("workspace:user:created", async ({ stream: id, data: { workspaceId, identityId }, meta, created }) => {
  await db.collection("workspace:users").insertOne({
    id,
    workspaceId,
    identityId,
    name: {
      given: "",
      family: "",
    },
    contacts: [],
    createdAt: getDate(created),
    createdBy: meta.user.uid ?? "Unknown",
  });
});
