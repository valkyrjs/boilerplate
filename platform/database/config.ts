import { getEnvironmentVariable } from "@platform/config";
import z from "zod";

export const config = {
  host: getEnvironmentVariable({
    key: "DB_XTDB_HOST",
    type: z.string(),
    fallback: "localhost",
  }),
  port: getEnvironmentVariable({
    key: "DB_XTDB_PORT",
    type: z.coerce.number(),
    fallback: "5432",
  }),
  user: getEnvironmentVariable({
    key: "DB_XTDB_USER",
    type: z.string(),
    fallback: "xtdb",
  }),
  pass: getEnvironmentVariable({
    key: "DB_XTDB_PASSWORD",
    type: z.string(),
    fallback: "xtdb",
  }),
};
