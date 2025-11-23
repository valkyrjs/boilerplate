import "@platform/relay";
import "@platform/storage";

import { SocketRegistry } from "./sockets.ts";

declare module "@platform/storage" {
  interface StorageContext {
    /**
     * TODO ...
     */
    sockets?: SocketRegistry;
  }
}

declare module "@platform/relay" {
  export interface ServerContext {
    /**
     * TODO ...
     */
    sockets: SocketRegistry;
  }
}
