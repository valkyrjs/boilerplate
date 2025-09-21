import { HttpAdapter, makeClient } from "@platform/relay";
import { PrincipalProvider } from "@valkyr/auth";

import { config } from "../config.ts";
import resolve from "../routes/identities/resolve/spec.ts";
import { RoleSchema } from "../schemas/role.ts";

export const identity = makeClient(
  {
    adapter: new HttpAdapter({
      url: config.url,
    }),
  },
  {
    resolve: resolve.crypto({
      publicKey: config.internal.publicKey,
    }),
  },
);

export const principal = new PrincipalProvider(RoleSchema, {}, async function (id: string) {
  const response = await identity.resolve({ params: { id } });
  if ("data" in response) {
    return {
      id,
      roles: response.data.roles,
      attributes: {},
    };
  }
});

export type Principal = typeof principal.$principal;
