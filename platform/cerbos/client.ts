import { HTTP } from "@cerbos/http";
import { getEnvironmentVariable } from "@platform/config/environment.ts";
import z from "zod";

export const cerbos = new HTTP(
  getEnvironmentVariable({
    key: "CERBOS_URL",
    type: z.string(),
    fallback: "http://localhost:3592",
  }),
  {
    adminCredentials: {
      username: "cerbos",
      password: "cerbosAdmin",
    },
  },
);
