import { context, UnauthorizedError } from "@platform/relay";
import { storage } from "@platform/storage";

const IDENTITY_RESOLVE_HEADER = "x-identity-resolver";

export default {
  bootstrap: async () => {
    bootstrapSessionContext();
  },

  resolve: async (request: Request) => {
    await resolvePrincipalSession(request);
  },
};

function bootstrapSessionContext() {
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

async function resolvePrincipalSession(request: Request) {
  // ### Resolver
  // Check if the incoming request is tagged as a resolver check.
  // If it is a resolver we break out of the session resolution
  // to avoid an infinite resolution loop.

  const isResolver = request.headers.get(IDENTITY_RESOLVE_HEADER) !== null;
  if (isResolver) {
    return;
  }

  // ### Cookie
  // Check for the existence of cookie to pass onto the session
  // resolver.

  const cookie = request.headers.get("cookie");
  if (cookie === null) {
    return;
  }

  // ### Session
  // Fetch session from identity module and tag it as a resolution
  // call so it can break out of a resolution loop.

  const session = await getPrincipalSession({
    headers: new Headers({
      cookie,
      [IDENTITY_RESOLVE_HEADER]: "true",
    }),
  });

  // ### Populate Context
  // On successfull resolution we build the request identity context.

  if (session !== undefined) {
    const context = storage.getStore();
    if (context === undefined) {
      return;
    }
    context.session = session.session;
    context.principal = session.principal;
    context.access = identity.access;
  }
}
