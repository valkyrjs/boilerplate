import "@platform/relay";
import "@platform/storage";

import type { Access } from "./auth/access.ts";
import type { Principal } from "./auth/principal.ts";

declare module "@platform/storage" {
  interface StorageContext {
    /**
     * TODO ...
     */
    principal?: Principal;

    /**
     * TODO ...
     */
    access?: Access;
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
    principal: Principal;

    /**
     * TODO ...
     */
    access: Access;
  }
}
