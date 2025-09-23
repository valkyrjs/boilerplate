import { container } from "@platform/database/container.ts";
import { EventFactory, EventStore, Prettify, Projector } from "@valkyr/event-store";
import { MongoAdapter } from "@valkyr/event-store/mongo";

/*
 |--------------------------------------------------------------------------------
 | Event Factory
 |--------------------------------------------------------------------------------
 */

const eventFactory = new EventFactory([
  ...(await import("./events/workspace.ts")).default,
  ...(await import("./events/workspace-user.ts")).default,
]);

/*
 |--------------------------------------------------------------------------------
 | Event Store
 |--------------------------------------------------------------------------------
 */

export const eventStore = new EventStore({
  adapter: new MongoAdapter(() => container.get("mongo"), `workspace:event-store`),
  events: eventFactory,
  snapshot: "auto",
});

/*
 |--------------------------------------------------------------------------------
 | Projector
 |--------------------------------------------------------------------------------
 */

export const projector = new Projector<EventStoreFactory>();

eventStore.onEventsInserted(async (records, { batch }) => {
  if (batch !== undefined) {
    await projector.pushMany(batch, records);
  } else {
    for (const record of records) {
      await projector.push(record, { hydrated: false, outdated: false });
    }
  }
});

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type EventStoreFactory = typeof eventFactory;

export type EventRecord = Prettify<EventStoreFactory["$events"][number]["$record"]>;
