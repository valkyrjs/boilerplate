import { ConflictError } from "@platform/relay";

export class AccountEmailClaimedError extends ConflictError {
  constructor(email: string) {
    super(`Email '${email}' is already claimed by another account.`);
  }
}
