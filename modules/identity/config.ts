import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { getEnvironmentVariable } from "@platform/config/environment.ts";
import type { SerializeOptions } from "cookie";
import z from "zod";

export const config = {
  url: getEnvironmentVariable({
    key: "IDENTITY_SERVICE_URL",
    type: z.url(),
    fallback: "http://localhost:8370",
  }),
  auth: {
    privateKey: getEnvironmentVariable({
      key: "AUTH_PRIVATE_KEY",
      type: z.string(),
      fallback: await readFile(resolve(import.meta.dirname!, ".keys", "private"), "utf-8"),
    }),
    publicKey: getEnvironmentVariable({
      key: "AUTH_PUBLIC_KEY",
      type: z.string(),
      fallback: await readFile(resolve(import.meta.dirname!, ".keys", "public"), "utf-8"),
    }),
  },
  internal: {
    privateKey: getEnvironmentVariable({
      key: "INTERNAL_PRIVATE_KEY",
      type: z.string(),
      fallback:
        "-----BEGIN PRIVATE KEY-----\n" +
        "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg2WYKMJZUWff5XOWC\n" +
        "XGuU+wmsRzhQGEIzfUoL6rrGoaehRANCAATCpiGiFQxTA76EIVG0cBbj+AFt6BuJ\n" +
        "t4q+zoInPUzkChCdwI+XfAYokrZwBjcyRGluC02HaN3cptrmjYSGSMSx\n" +
        "-----END PRIVATE KEY-----",
    }),
    publicKey: getEnvironmentVariable({
      key: "INTERNAL_PUBLIC_KEY",
      type: z.string(),
      fallback:
        "-----BEGIN PUBLIC KEY-----\n" +
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEwqYhohUMUwO+hCFRtHAW4/gBbegb\n" +
        "ibeKvs6CJz1M5AoQncCPl3wGKJK2cAY3MkRpbgtNh2jd3Kba5o2EhkjEsQ==\n" +
        "-----END PUBLIC KEY-----",
    }),
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
