import "./types.d.ts";

import { context, InternalServerError } from "@platform/relay";
import { getStorageContext, storage } from "@platform/storage";

import { SocketRegistry } from "./sockets.ts";

export const sockets = new SocketRegistry();

export default {
  /**
   * TODO ...
   */
  bootstrap: async (): Promise<void> => {
    Object.defineProperties(context, {
      /**
       * TODO ...
       */
      sockets: {
        get() {
          const sockets = storage.getStore()?.sockets;
          if (sockets === undefined) {
            throw new InternalServerError("Sockets not defined.");
          }
          return sockets;
        },
      },
    });
  },

  /**
   * TODO ...
   */
  resolve: async (): Promise<void> => {
    const context = getStorageContext();
    context.sockets = sockets;
  },
};
