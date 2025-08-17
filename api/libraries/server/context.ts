import { ServerContext } from "@spec/relay";

import type { Sockets } from "~libraries/socket/sockets.ts";

import { Session } from "../auth/auth.ts";
import { req } from "./request.ts";

declare module "@spec/relay" {
  interface ServerContext {
    /**
     * Current request instance being  handled.
     */
    request: Request;

    /**
     * Is the request authenticated.
     */
    isAuthenticated: boolean;

    /**
     * Get account id from session, throws an error if the request
     * does not have a valid session.
     */
    accountId: string;

    /**
     * Get request session instance.
     */
    session: Session;

    /**
     * Sockets instance attached to the server.
     */
    sockets: Sockets;
  }
}

export function getRequestContext(request: Request): ServerContext {
  return {
    request,

    get isAuthenticated(): boolean {
      return req.isAuthenticated;
    },

    get accountId() {
      return this.session.accountId;
    },

    get session(): Session {
      return req.session;
    },

    get sockets(): Sockets {
      return req.sockets;
    },
  };
}
