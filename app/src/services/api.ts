import { account } from "@module/account/client";
import { ledger } from "@module/ledger/client";
import { makeClient } from "@platform/relay";

import { HttpAdapter } from "./adapters/http.ts";

export const api = makeClient(
  {
    adapter: new HttpAdapter({
      url: window.location.origin,
    }),
  },
  {
    account,
    ledger,
  },
);
