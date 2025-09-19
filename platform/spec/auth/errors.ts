import { BadRequestError } from "@platform/relay";

export class AuthenticationStrategyPayloadError extends BadRequestError {
  constructor() {
    super("Provided authentication payload is not recognized.");
  }
}
