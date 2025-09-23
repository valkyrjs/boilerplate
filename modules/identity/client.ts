import { HttpAdapter, makeClient } from "@platform/relay";

import { config } from "./config.ts";
import getById from "./routes/identities/get/spec.ts";
import loginByPassword from "./routes/login/code/spec.ts";
import loginByEmail from "./routes/login/email/spec.ts";
import loginByCode from "./routes/login/password/spec.ts";
import me from "./routes/me/spec.ts";

export const identity = makeClient(
  {
    adapter: new HttpAdapter({
      url: config.url,
    }),
  },
  {
    /**
     * TODO ...
     */
    getById,

    /**
     * TODO ...
     */
    me,

    /**
     * TODO ...
     */
    login: {
      /**
       * TODO ...
       */
      email: loginByEmail,

      /**
       * TODO ...
       */
      password: loginByPassword,

      /**
       * TODO ...
       */
      code: loginByCode,
    },
  },
);
