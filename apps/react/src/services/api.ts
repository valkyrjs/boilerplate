import { makeClient } from "@platform/relay";

import { HttpAdapter } from "../adapters/http.ts";

export const api = makeClient(
  {
    adapter: new HttpAdapter({
      url: window.location.origin,
    }),
  },
  {
    account: (await import("@platform/spec/account/routes.ts")).routes,
    auth: (await import("@platform/spec/auth/routes.ts")).routes,
  },
);
