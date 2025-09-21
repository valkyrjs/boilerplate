import { resources } from "@platform/cerbos/resources.ts";
import { Auth } from "@valkyr/auth";

import { access } from "./auth/access.ts";
import { jwt } from "./auth/jwt.ts";
import { principal } from "./auth/principal.ts";

export const auth = new Auth({
  principal,
  resources,
  access,
  jwt,
});

export type Session = typeof auth.$session;
