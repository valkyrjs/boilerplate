import { HttpAdapter, makeClient } from "@platform/relay";

import { config } from "./config.ts";
import resolve from "./routes/session/resolve/spec.ts";

/*
 |--------------------------------------------------------------------------------
 | Internal Session Resolver
 |--------------------------------------------------------------------------------
 */

export const identity = makeClient(
  {
    adapter: new HttpAdapter({
      url: config.url,
    }),
  },
  {
    resolve: resolve.crypto({
      publicKey: config.internal.publicKey,
    }),
  },
);

/*
 |--------------------------------------------------------------------------------
 | Server Exports
 |--------------------------------------------------------------------------------
 */

export * from "./services/access.ts";
export * from "./services/session.ts";
export * from "./types.ts";

/*
 |--------------------------------------------------------------------------------
 | Module Server
 |--------------------------------------------------------------------------------
 */

export default {
  routes: [
    (await import("./routes/identities/get/handle.ts")).default,
    (await import("./routes/identities/update/handle.ts")).default,
    (await import("./routes/login/code/handle.ts")).default,
    (await import("./routes/login/email/handle.ts")).default,
    // (await import("./routes/login/password/handle.ts")).default,
    (await import("./routes/login/sudo/handle.ts")).default,
    (await import("./routes/me/handle.ts")).default,
    (await import("./routes/roles/handle.ts")).default,
    (await import("./routes/session/resolve/handle.ts")).default,
  ],
};
