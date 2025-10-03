import { AsyncLocalStorage } from "node:async_hooks";

import { InternalServerError } from "@platform/relay";

export const storage = new AsyncLocalStorage<StorageContext>();

/**
 * TODO ...
 */
export function getStorageContext(): StorageContext {
  const store = storage.getStore();
  if (store === undefined) {
    throw new InternalServerError(
      "Storage 'store' missing, make sure to resolve within a 'node:async_hooks' wrapped context.",
    );
  }
  return store;
}

export interface StorageContext {
  id: string;
}
