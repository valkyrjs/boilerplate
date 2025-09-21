import "./types.d.ts";

import { idIndex } from "@platform/database/id.ts";
import { register as registerReadStore } from "@platform/database/registrar.ts";
import { UnauthorizedError } from "@platform/relay";
import { context } from "@platform/relay";
import { storage } from "@platform/storage";
import { register as registerEventStore } from "@valkyr/event-store/mongo";
import cookie from "cookie";

import { auth } from "./auth.ts";
import { db } from "./database.ts";
import { eventStore } from "./event-store.ts";

export default {
  routes: [
    (await import("./routes/identities/get/handle.ts")).default,
    (await import("./routes/identities/register/handle.ts")).default,
    (await import("./routes/identities/me/handle.ts")).default,
    (await import("./routes/identities/resolve/handle.ts")).default,
    (await import("./routes/login/code/handle.ts")).default,
    (await import("./routes/login/email/handle.ts")).default,
    (await import("./routes/login/password/handle.ts")).default,
  ],

  /**
   * TODO ...
   */
  bootstrap: async (): Promise<void> => {
    await registerReadStore(db.db, [
      {
        name: "identities",
        indexes: [
          idIndex,
          [{ "strategies.type": 1, "strategies.alias": 1 }, { name: "strategy.password" }],
          [{ "strategies.type": 1, "strategies.value": 1 }, { name: "strategy.email" }],
        ],
      },
    ]);
    await registerEventStore(eventStore.db.db, console.info);
    Object.defineProperties(context, {
      /**
       * TODO ...
       */
      isAuthenticated: {
        get() {
          return storage.getStore()?.principal !== undefined;
        },
      },

      /**
       * TODO ...
       */
      principal: {
        get() {
          const principal = storage.getStore()?.principal;
          if (principal === undefined) {
            throw new UnauthorizedError();
          }
          return principal;
        },
      },

      /**
       * TODO ...
       */
      access: {
        get() {
          const access = storage.getStore()?.access;
          if (access === undefined) {
            throw new UnauthorizedError();
          }
          return access;
        },
      },
    });
  },

  /**
   * TODO ...
   */
  resolve: async (request: Request): Promise<void> => {
    const token = cookie.parse(request.headers.get("cookie") ?? "").token;
    if (token !== undefined) {
      const session = await auth.resolve(token);
      if (session.valid === true) {
        const context = storage.getStore();
        if (context === undefined) {
          return;
        }
        context.principal = session.principal;
        context.access = session.access;
      }
    }
  },
};
