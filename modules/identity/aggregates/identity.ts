import { AuditActor, auditors } from "@platform/spec/audit/actor.ts";
import { AggregateRoot, getDate } from "@valkyr/event-store";

import { db } from "../database.ts";
import { type EventRecord, eventStore, type EventStoreFactory, projector } from "../event-store.ts";
import type { Avatar } from "../schemas/avatar.ts";
import type { Contact } from "../schemas/contact.ts";
import type { Email } from "../schemas/email.ts";
import type { Name } from "../schemas/name.ts";
import type { Role } from "../schemas/role.ts";
import type { Strategy } from "../schemas/strategies.ts";

export class Identity extends AggregateRoot<EventStoreFactory> {
  static override readonly name = "identity";

  avatar?: Avatar;
  name?: Name;
  contact: Contact = {
    emails: [],
  };
  strategies: Strategy[] = [];
  roles: Role[] = [];

  createdAt!: Date;
  updatedAt!: Date;

  // -------------------------------------------------------------------------
  // Reducer
  // -------------------------------------------------------------------------

  with(event: EventRecord): void {
    switch (event.type) {
      case "identity:created": {
        this.id = event.stream;
        this.createdAt = getDate(event.created);
        break;
      }
      case "identity:avatar:added": {
        this.avatar = { url: event.data };
        this.updatedAt = getDate(event.created);
        break;
      }
      case "identity:name:added": {
        this.name = event.data;
        this.updatedAt = getDate(event.created);
        break;
      }
      case "identity:email:added": {
        this.contact.emails.push(event.data);
        this.updatedAt = getDate(event.created);
        break;
      }
      case "identity:role:added": {
        this.roles.push(event.data);
        this.updatedAt = getDate(event.created);
        break;
      }
      case "identity:strategy:email:added": {
        this.strategies.push({ type: "email", value: event.data });
        this.updatedAt = getDate(event.created);
        break;
      }
      case "identity:strategy:password:added": {
        this.strategies.push({ type: "password", ...event.data });
        this.updatedAt = getDate(event.created);
        break;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  create(meta: AuditActor = auditors.system) {
    return this.push({
      stream: this.id,
      type: "identity:created",
      meta,
    });
  }

  addAvatar(url: string, meta: AuditActor = auditors.system): this {
    return this.push({
      stream: this.id,
      type: "identity:avatar:added",
      data: url,
      meta,
    });
  }

  addName(name: Name, meta: AuditActor = auditors.system): this {
    return this.push({
      stream: this.id,
      type: "identity:name:added",
      data: name,
      meta,
    });
  }

  addEmail(email: Email, meta: AuditActor = auditors.system): this {
    return this.push({
      stream: this.id,
      type: "identity:email:added",
      data: email,
      meta,
    });
  }

  addRole(role: Role, meta: AuditActor = auditors.system): this {
    return this.push({
      stream: this.id,
      type: "identity:role:added",
      data: role,
      meta,
    });
  }

  addEmailStrategy(email: string, meta: AuditActor = auditors.system): this {
    return this.push({
      stream: this.id,
      type: "identity:strategy:email:added",
      data: email,
      meta,
    });
  }

  addPasswordStrategy(alias: string, password: string, meta: AuditActor = auditors.system): this {
    return this.push({
      stream: this.id,
      type: "identity:strategy:password:added",
      data: { alias, password },
      meta,
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export async function isEmailClaimed(email: string): Promise<boolean> {
  const relations = await eventStore.relations.getByKey(getIdentityEmailRelation(email));
  if (relations.length > 0) {
    return true;
  }
  return false;
}

/*
 |--------------------------------------------------------------------------------
 | Relations
 |--------------------------------------------------------------------------------
 */

export function getIdentityEmailRelation(email: string): string {
  return `/identities/emails/${email}`;
}

export function getIdentityAliasRelation(alias: string): string {
  return `/identities/aliases/${alias}`;
}

/*
 |--------------------------------------------------------------------------------
 | Projectors
 |--------------------------------------------------------------------------------
 */

projector.on("identity:created", async ({ stream: id }) => {
  await db.collection("identities").insertOne({
    id,
    name: {
      given: null,
      family: null,
    },
    contact: {
      emails: [],
    },
    strategies: [],
    roles: [],
  });
});

projector.on("identity:avatar:added", async ({ stream: id, data: url }) => {
  await db.collection("identities").updateOne({ id }, { $set: { avatar: { url } } });
});

projector.on("identity:name:added", async ({ stream: id, data: name }) => {
  await db.collection("identities").updateOne({ id }, { $set: { name } });
});

projector.on("identity:email:added", async ({ stream: id, data: email }) => {
  await db.collection("identities").updateOne({ id }, { $push: { "contact.emails": email } });
});

projector.on("identity:role:added", async ({ stream: id, data: role }) => {
  await db.collection("identities").updateOne({ id }, { $push: { roles: role } });
});

projector.on("identity:strategy:email:added", async ({ stream: id, data: email }) => {
  await eventStore.relations.insert(getIdentityEmailRelation(email), id);
  await db.collection("identities").updateOne({ id }, { $push: { strategies: { type: "email", value: email } } });
});

projector.on("identity:strategy:password:added", async ({ stream: id, data: strategy }) => {
  await eventStore.relations.insert(getIdentityAliasRelation(strategy.alias), id);
  await db.collection("identities").updateOne({ id }, { $push: { strategies: { type: "password", ...strategy } } });
});
