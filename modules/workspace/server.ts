import { idIndex } from "@platform/database/id.ts";
import { register as registerReadStore } from "@platform/database/registrar.ts";
import { register as registerEventStore } from "@valkyr/event-store/mongo";

import { db } from "./database.ts";
import { eventStore } from "./event-store.ts";

export default {
  routes: [(await import("./routes/workspaces/create/handle.ts")).default],

  bootstrap: async (): Promise<void> => {
    await registerReadStore(db.db, [
      {
        name: "workspaces",
        indexes: [
          idIndex,
          // [{ "strategies.type": 1, "strategies.alias": 1 }, { name: "strategy.password" }],
        ],
      },
      {
        name: "workspace:users",
        indexes: [
          idIndex,
          // [{ "strategies.type": 1, "strategies.alias": 1 }, { name: "strategy.password" }],
        ],
      },
    ]);
    await registerEventStore(eventStore.db.db, console.info);
  },
};
