import { config } from "./config.ts";
import { getMongoClient } from "./connection.ts";

export const mongo = getMongoClient(config.mongo);
