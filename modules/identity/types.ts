import "@platform/relay";
import "@platform/storage";

import type { Session } from "better-auth";

import type { identity } from "./client.ts";
import type { Principal } from "./models/principal.ts";

declare module "@platform/storage" {
  interface StorageContext {
    /**
     * TODO ...
     */
    session?: Session;

    /**
     * TODO ...
     */
    principal?: Principal;

    /**
     * TODO ...
     */
    access?: typeof identity.access;
  }
}

declare module "@platform/relay" {
  interface ServerContext {
    /**
     * TODO ...
     */
    isAuthenticated: boolean;

    /**
     * TODO ...
     */
    session: Session;

    /**
     * TODO ...
     */
    principal: Principal;

    /**
     * TODO ...
     */
    access: typeof identity.access;
  }
}
