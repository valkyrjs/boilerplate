import { InternalServerError, UnauthorizedError } from "@spec/relay";

import { Session } from "../auth/auth.ts";
import { storage } from "./storage.ts";

export const req = {
  get store() {
    const store = storage.getStore();
    if (store === undefined) {
      throw new InternalServerError("AsyncLocalStorage not defined.");
    }
    return store;
  },

  get sockets() {
    if (this.store.sockets === undefined) {
      throw new InternalServerError("Sockets not defined.");
    }
    return this.store.sockets;
  },

  /**
   * Check if the request is authenticated.
   */
  get isAuthenticated(): boolean {
    return this.session !== undefined;
  },

  /**
   * Get current session.
   */
  get session(): Session {
    if (this.store.session === undefined) {
      throw new UnauthorizedError();
    }
    return this.store.session;
  },

  /**
   * Gets the meta information stored in the request.
   */
  get info() {
    return this.store.info;
  },

  /**
   * Get current session.
   */
  getSession(): Session | undefined {
    return this.store.session;
  },

  /**
   * Get store that is potentially undefined.
   * Typically used when utility functions might run in and out of request scope.
   */
  getStore() {
    return storage.getStore();
  },
} as const;

export type ReqContext = typeof req;
