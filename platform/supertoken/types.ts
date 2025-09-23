import "@platform/relay";
import "@platform/storage";

import type Session from "supertokens-node/recipe/session";

import type { AccessControlMethods } from "./access.ts";
import type { Principal } from "./principal.ts";

declare module "@platform/storage" {
  interface StorageContext {
    /**
     * TODO ...
     */
    session?: Session.SessionContainer;

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
    session: Session.SessionContainer;

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
