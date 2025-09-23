import "./types.ts";

import { UnauthorizedError } from "@platform/relay";
import { context } from "@platform/relay";
import { storage } from "@platform/storage";
import cookie from "cookie";
import supertokens from "supertokens-node";
import Passwordless from "supertokens-node/recipe/passwordless";
import Session from "supertokens-node/recipe/session";

import { getAccessControlMethods } from "./access.ts";
import { config } from "./config.ts";
import { getPrincipalAttributes, getPrincipalRoles, Principal } from "./principal.ts";
import { getSessionByAccessToken } from "./session.ts";

/*
 |--------------------------------------------------------------------------------
 | Server Module
 |--------------------------------------------------------------------------------
 */

export default {
  bootsrap: async () => {
    bootstrapSuperTokens();
    bootstrapStorageContext();
  },
  resolve: async (request: Request): Promise<void> => {
    await resolveSession(request);
  },
};

/*
 |--------------------------------------------------------------------------------
 | Bootstrap Methods
 |--------------------------------------------------------------------------------
 */

function bootstrapSuperTokens() {
  supertokens.init({
    framework: "custom",
    supertokens: config.supertokens,
    appInfo: config.appInfo,
    recipeList: [
      Passwordless.init({
        flowType: "USER_INPUT_CODE",
        contactMethod: "EMAIL",
      }),
      Session.init({
        getTokenTransferMethod: () => "cookie",
      }),
    ],
  });
}

function bootstrapStorageContext() {
  Object.defineProperties(context, {
    /**
     * TODO ...
     */
    isAuthenticated: {
      get() {
        return storage.getStore()?.principal !== undefined;
      },
    },

    /**
     * TODO ...
     */
    session: {
      get() {
        const session = storage.getStore()?.session;
        if (session === undefined) {
          throw new UnauthorizedError();
        }
        return session;
      },
    },

    /**
     * TODO ...
     */
    principal: {
      get() {
        const principal = storage.getStore()?.principal;
        if (principal === undefined) {
          throw new UnauthorizedError();
        }
        return principal;
      },
    },

    /**
     * TODO ...
     */
    access: {
      get() {
        const access = storage.getStore()?.access;
        if (access === undefined) {
          throw new UnauthorizedError();
        }
        return access;
      },
    },
  });
}

/*
 |--------------------------------------------------------------------------------
 | Request Middleware
 |--------------------------------------------------------------------------------
 */

async function resolveSession(request: Request): Promise<void> {
  const accessToken = cookie.parse(request.headers.get("cookie") ?? "").sAccessToken;
  if (accessToken !== undefined) {
    const session = await getSessionByAccessToken(accessToken);

    const store = storage.getStore();
    if (store === undefined) {
      return;
    }

    const principal: Principal = {
      id: session.getUserId(),
      roles: await getPrincipalRoles(session.getUserId()),
      attr: await getPrincipalAttributes(session.getUserId()),
    };

    store.session = session;
    store.principal = principal;
    store.access = getAccessControlMethods(principal);
  }
}
