import { getEnvironmentVariable } from "@platform/config/environment.ts";
import z from "zod";

export const config = {
  url: getEnvironmentVariable({
    key: "IDENTITY_SERVICE_URL",
    type: z.url(),
    fallback: "http://localhost:8370",
  }),
};
