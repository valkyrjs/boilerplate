import { getEnvironmentVariable } from "@platform/config/environment.ts";
import type { SerializeOptions } from "cookie";
import z from "zod";

export const config = {
  supertokens: {
    connectionURI: getEnvironmentVariable({
      key: "SUPERTOKEN_URI",
      type: z.string(),
      fallback: "http://localhost:3567",
    }),
  },
  appInfo: {
    appName: getEnvironmentVariable({
      key: "PROJECT_NAME",
      type: z.string(),
      fallback: "Boilerplate",
    }),
    apiDomain: getEnvironmentVariable({
      key: "API_DOMAIN",
      type: z.string(),
      fallback: "http://localhost:8370",
    }),
    websiteDomain: getEnvironmentVariable({
      key: "APP_DOMAIN",
      type: z.string(),
      fallback: "http://localhost:3000",
    }),
    apiBasePath: "/api/v1/identity",
    websiteBasePath: "/auth",
  },
  cookie: (maxAge: number) =>
    ({
      httpOnly: true,
      secure: getEnvironmentVariable({
        key: "AUTH_COOKIE_SECURE",
        type: z.coerce.boolean(),
        fallback: "false",
      }), // Set to true for HTTPS in production
      maxAge,
      path: "/",
      sameSite: "strict",
    }) satisfies SerializeOptions,
};
