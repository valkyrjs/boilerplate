import { Client } from "./client.ts";
import { config } from "./config.ts";

export * from "./client.ts";

export const db = new Client(config);
