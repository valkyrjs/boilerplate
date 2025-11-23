import { SERVICE_ENV } from "./service.ts";

export class InvalidServiceEnvironmentError extends Error {
  readonly code = "INVALID_SERVICE_ENVIRONMENT";

  constructor(value: string) {
    super(
      `@platform/config requested invalid service environment, expected '${SERVICE_ENV.join(", ")}' got '${value}'.`,
    );
  }
}

export class InvalidEnvironmentKeyError extends Error {
  readonly code = "INVALID_ENVIRONMENT_KEY";

  constructor(
    key: string,
    readonly details: unknown,
  ) {
    super(`@platform/config invalid environment key '${key}' provided.`);
  }
}
