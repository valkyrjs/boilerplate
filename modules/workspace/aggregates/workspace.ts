import { AuditActor, auditors } from "@platform/spec/audit/actor.ts";
import { AggregateRoot, getDate } from "@valkyr/event-store";

import { db } from "../database.ts";
import { EventRecord, EventStoreFactory, projector } from "../event-store.ts";

export class Workspace extends AggregateRoot<EventStoreFactory> {
  static override readonly name = "workspace";

  ownerId!: string;

  name!: string;
  description?: string;
  archived = false;

  createdAt!: Date;
  updatedAt?: Date;

  // -------------------------------------------------------------------------
  // Reducer
  // -------------------------------------------------------------------------

  with(event: EventRecord): void {
    switch (event.type) {
      case "workspace:created": {
        this.id = event.stream;
        this.ownerId = event.data.ownerId;
        this.name = event.data.name;
        this.createdAt = getDate(event.created);
        break;
      }
      case "workspace:name:added": {
        this.name = event.data;
        this.updatedAt = getDate(event.created);
        break;
      }
      case "workspace:description:added": {
        this.description = event.data;
        this.updatedAt = getDate(event.created);
        break;
      }
      case "workspace:archived": {
        this.archived = true;
        this.updatedAt = getDate(event.created);
        break;
      }
      case "workspace:restored": {
        this.archived = false;
        this.updatedAt = getDate(event.created);
        break;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  create(ownerId: string, name: string, meta: AuditActor = auditors.system) {
    return this.push({
      stream: this.id,
      type: "workspace:created",
      data: {
        ownerId,
        name,
      },
      meta,
    });
  }

  setName(name: string, meta: AuditActor = auditors.system) {
    return this.push({
      stream: this.id,
      type: "workspace:name:added",
      data: name,
      meta,
    });
  }

  setDescription(description: string, meta: AuditActor = auditors.system) {
    return this.push({
      stream: this.id,
      type: "workspace:description:added",
      data: description,
      meta,
    });
  }

  archive(meta: AuditActor = auditors.system) {
    return this.push({
      stream: this.id,
      type: "workspace:archived",
      meta,
    });
  }

  restore(meta: AuditActor = auditors.system) {
    return this.push({
      stream: this.id,
      type: "workspace:restored",
      meta,
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Projectors
 |--------------------------------------------------------------------------------
 */

projector.on("workspace:created", async ({ stream: id, data: { ownerId, name }, meta, created }) => {
  await db.collection("workspaces").insertOne({
    id,
    ownerId,
    name,
    createdAt: getDate(created),
    createdBy: meta.user.uid ?? "Unknown",
  });
});
