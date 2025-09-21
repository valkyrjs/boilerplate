import { NotFoundError, route, UnauthorizedError } from "@platform/relay";

import { IdentitySchema } from "../../../models/identity.ts";

export default route.get("/api/v1/identities/me").response(IdentitySchema).errors([UnauthorizedError, NotFoundError]);
