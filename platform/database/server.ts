import { config } from "./config.ts";
import { getMongoClient } from "./connection.ts";
import { container } from "./container.ts";

export default {
  bootstrap: async (): Promise<void> => {
    container.set("mongo", getMongoClient(config.mongo));
  },
};
