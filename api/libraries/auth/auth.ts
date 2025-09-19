import { Auth } from "@valkyr/auth";

import { access } from "./access.ts";
import { config } from "./config.ts";
import { principal } from "./principal.ts";
import { resources } from "./resources.ts";

export const auth = new Auth({
  principal,
  resources,
  access,
  jwt: {
    algorithm: "RS256",
    privateKey: config.privateKey,
    publicKey: config.publicKey,
    issuer: "http://localhost",
    audience: "http://localhost",
  },
});

export type Session = typeof auth.$session;
