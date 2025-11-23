import { getDotEnvVariable } from "./dotenv.ts";

export const SERVICE_ENV = ["testing", "local", "stg", "demo", "prod"] as const;

/**
 * TODO ...
 */
export function getServiceEnvironment(): ServiceEnvironment {
  const value = getDotEnvVariable("SERVICE_ENV");
  if (value === undefined) {
    return "local";
  }
  if ((SERVICE_ENV as unknown as string[]).includes(value) === false) {
    throw new Error(`Config Exception: Invalid env ${value} provided`);
  }
  return value as ServiceEnvironment;
}

export type ServiceEnvironment = (typeof SERVICE_ENV)[number];
