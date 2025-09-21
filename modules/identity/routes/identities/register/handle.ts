import { Identity, isEmailClaimed } from "../../../aggregates/identity.ts";
import { IdentityEmailClaimedError } from "../../../errors.ts";
import { eventStore } from "../../../event-store.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ body: { name, email } }) => {
  if ((await isEmailClaimed(email)) === true) {
    return new IdentityEmailClaimedError(email);
  }
  return eventStore.aggregate.from(Identity).create().addName(name).addEmailStrategy(email).addRole("user").save();
});
