import { toAccountDocument } from "@platform/models/account.ts";
import { Avatar } from "@platform/models/value-objects/avatar.ts";
import { Contact } from "@platform/models/value-objects/contact.ts";
import { Email } from "@platform/models/value-objects/email.ts";
import { Name } from "@platform/models/value-objects/name.ts";
import { Role } from "@platform/spec/account/role.ts";
import { Strategy } from "@platform/spec/account/strategies.ts";
import { AggregateRoot, getDate } from "@valkyr/event-store";

import { db } from "~stores/read-store/database.ts";

import { eventStore } from "../event-store.ts";
import { Auditor, systemAuditor } from "../events/auditor.ts";
import { EventRecord, EventStoreFactory } from "../events/mod.ts";
import { projector } from "../projector.ts";

export class Account extends AggregateRoot<EventStoreFactory> {
  static override readonly name = "account";

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
      case "account:created": {
        this.id = event.stream;
        this.createdAt = getDate(event.created);
        break;
      }
      case "account:avatar:added": {
        this.avatar = { url: event.data };
        this.updatedAt = getDate(event.created);
        break;
      }
      case "account:name:added": {
        this.name = event.data;
        this.updatedAt = getDate(event.created);
        break;
      }
      case "account:email:added": {
        this.contact.emails.push(event.data);
        this.updatedAt = getDate(event.created);
        break;
      }
      case "account:role:added": {
        this.roles.push(event.data);
        this.updatedAt = getDate(event.created);
        break;
      }
      case "strategy:email:added": {
        this.strategies.push({ type: "email", value: event.data });
        this.updatedAt = getDate(event.created);
        break;
      }
      case "strategy:password:added": {
        this.strategies.push({ type: "password", ...event.data });
        this.updatedAt = getDate(event.created);
        break;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  create(meta: Auditor = systemAuditor) {
    return this.push({
      stream: this.id,
      type: "account:created",
      meta,
    });
  }

  addAvatar(url: string, meta: Auditor = systemAuditor): this {
    return this.push({
      stream: this.id,
      type: "account:avatar:added",
      data: url,
      meta,
    });
  }

  addName(name: Name, meta: Auditor = systemAuditor): this {
    return this.push({
      stream: this.id,
      type: "account:name:added",
      data: name,
      meta,
    });
  }

  addEmail(email: Email, meta: Auditor = systemAuditor): this {
    return this.push({
      stream: this.id,
      type: "account:email:added",
      data: email,
      meta,
    });
  }

  addRole(role: Role, meta: Auditor = systemAuditor): this {
    return this.push({
      stream: this.id,
      type: "account:role:added",
      data: role,
      meta,
    });
  }

  addEmailStrategy(email: string, meta: Auditor = systemAuditor): this {
    return this.push({
      stream: this.id,
      type: "strategy:email:added",
      data: email,
      meta,
    });
  }

  addPasswordStrategy(alias: string, password: string, meta: Auditor = systemAuditor): this {
    return this.push({
      stream: this.id,
      type: "strategy:password:added",
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
  const relations = await eventStore.relations.getByKey(getAccountEmailRelation(email));
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

export function getAccountEmailRelation(email: string): string {
  return `/accounts/emails/${email}`;
}

export function getAccountAliasRelation(alias: string): string {
  return `/accounts/aliases/${alias}`;
}

/*
 |--------------------------------------------------------------------------------
 | Projectors
 |--------------------------------------------------------------------------------
 */

projector.on("account:created", async ({ stream: id }) => {
  await db.collection("accounts").insertOne(
    toAccountDocument({
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
    }),
  );
});

projector.on("account:avatar:added", async ({ stream: id, data: url }) => {
  await db.collection("accounts").updateOne({ id }, { $set: { avatar: { url } } });
});

projector.on("account:name:added", async ({ stream: id, data: name }) => {
  await db.collection("accounts").updateOne({ id }, { $set: { name } });
});

projector.on("account:email:added", async ({ stream: id, data: email }) => {
  await db.collection("accounts").updateOne({ id }, { $push: { "contact.emails": email } });
});

projector.on("account:role:added", async ({ stream: id, data: role }) => {
  await db.collection("accounts").updateOne({ id }, { $push: { roles: role } });
});

projector.on("strategy:email:added", async ({ stream: id, data: email }) => {
  await eventStore.relations.insert(getAccountEmailRelation(email), id);
  await db.collection("accounts").updateOne({ id }, { $push: { strategies: { type: "email", value: email } } });
});

projector.on("strategy:password:added", async ({ stream: id, data: strategy }) => {
  await eventStore.relations.insert(getAccountAliasRelation(strategy.alias), id);
  await db.collection("accounts").updateOne({ id }, { $push: { strategies: { type: "password", ...strategy } } });
});
