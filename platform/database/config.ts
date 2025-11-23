import { getEnvironmentVariable } from "@platform/config/environment.ts";
import z from "zod";

export const config = {
  mongo: {
    host: getEnvironmentVariable({
      key: "DB_MONGO_HOST",
      type: z.string(),
      fallback: "localhost",
    }),
    port: getEnvironmentVariable({
      key: "DB_MONGO_PORT",
      type: z.coerce.number(),
      fallback: "67017",
    }),
    user: getEnvironmentVariable({
      key: "DB_MONGO_USER",
      type: z.string(),
      fallback: "root",
    }),
    pass: getEnvironmentVariable({
      key: "DB_MONGO_PASSWORD",
      type: z.string(),
      fallback: "password",
    }),
  },
};
