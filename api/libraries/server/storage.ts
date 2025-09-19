import { AsyncLocalStorage } from "node:async_hooks";

import type { Session } from "~libraries/auth/mod.ts";
import type { Sockets } from "~libraries/socket/sockets.ts";

export const storage = new AsyncLocalStorage<Storage>();

export type Storage = {
  session?: Session;
  info: {
    method: string;
    start: number;
    end?: number;
  };
  sockets?: Sockets;
  response: {
    headers: Headers;
  };
};
