import "@platform/relay";
import "@platform/storage";

import type { Session } from "better-auth";

import type { AccessControlMethods } from "./access.ts";
import type { Principal } from "./principal.ts";

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
    access?: AccessControlMethods;
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
    access: AccessControlMethods;
  }
}
