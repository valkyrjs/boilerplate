import { join } from "node:path";

import { load } from "@std/dotenv";

const env = await load({ envPath: getDotEnvPath(), export: true });

/**
 * TODO ...
 */
export function getDotEnvVariable(key: string): string {
  return env[key] ?? Deno.env.get(key);
}

function getDotEnvPath(): string {
  const dirname = import.meta.dirname;
  if (dirname === undefined) {
    throw new Error("Unable to determine dirname in config");
  }
  return join(dirname, "..", "..", ".env");
}
