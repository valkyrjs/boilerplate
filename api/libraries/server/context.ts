import { ServerContext } from "@spec/relay";

import type { Sockets } from "~libraries/socket/sockets.ts";

import { Access } from "../auth/access.ts";
import { Session } from "../auth/auth.ts";
import { Principal } from "../auth/principal.ts";
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
     * Get request session instance.
     */
    session: Session;

    /**
     * Get request principal.
     */
    principal: Principal;

    /**
     * Get access control session.
     */
    access: Access;

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

    get session(): Session {
      return req.session;
    },

    get principal(): Principal {
      return req.session.principal;
    },

    get access(): Access {
      return req.session.access;
    },

    get sockets(): Sockets {
      return req.sockets;
    },
  };
}
