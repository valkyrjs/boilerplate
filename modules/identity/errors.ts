import { ConflictError } from "@platform/relay";

export class IdentityEmailClaimedError extends ConflictError {
  constructor(email: string) {
    super(`Email '${email}' is already claimed by another identity.`);
  }
}
