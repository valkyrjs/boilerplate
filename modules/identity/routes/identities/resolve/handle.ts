import { NotFoundError } from "@platform/relay";

import { config } from "../../../config.ts";
import { getIdentityById } from "../../../database.ts";
import route from "./spec.ts";

export default route.access(["internal:public", config.internal.privateKey]).handle(async ({ params: { id } }) => {
  const identity = await getIdentityById(id);
  if (identity === undefined) {
    return new NotFoundError();
  }
  return identity;
});
