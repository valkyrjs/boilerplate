import z, { ZodType } from "zod";

import { BadRequestError, NotFoundError, RelayError } from "./errors.ts";
import { Route, RouteMethod } from "./route.ts";

const SUPPORTED_MEHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export class Relay<TRoutes extends Route[]> {
  /**
   * Route maps funneling registered routes to the specific methods supported by
   * the relay instance.
   */
  readonly routes: Routes = {
    POST: [],
    GET: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
  };

  /**
   * List of paths in the '${method} ${path}' format allowing us to quickly throw
   * errors if a duplicate route path is being added.
   */
  readonly #paths = new Set<string>();

  /**
   * Route index in the '${method} ${path}' format allowing for quick access to
   * a specific route.
   */
  readonly #index = new Map<string, Route>();

  /**
   * Instantiate a new Relay instance.
   *
   * @param config - Relay configuration to apply to the instance.
   * @param routes - Routes to register with the instance.
   */
  constructor(
    readonly config: RelayConfig,
    routes: TRoutes,
  ) {
    const methods: (keyof typeof this.routes)[] = [];
    for (const route of routes) {
      this.#validateRoutePath(route);
      this.routes[route.method].push(route);
      methods.push(route.method);
      this.#index.set(`${route.method} ${route.path}`, route);
    }
    for (const method of methods) {
      this.routes[method].sort(byStaticPriority);
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Agnostic
   |--------------------------------------------------------------------------------
   */

  /**
   * Retrieve a route for the given method/path combination which can be further extended
   * for serving incoming third party requests.
   *
   * @param method - Method the route is registered for.
   * @param path   - Path the route is registered under.
   *
   * @examples
   *
   * ```ts
   * const relay = new Relay([
   *   route
   *     .post("/users")
   *     .body(
   *       z.object({
   *         name: z.object({ family: z.string(), given: z.string() }),
   *         email: z.string().check(z.email()),
   *       })
   *     )
   * ]);
   *
   * relay
   *   .route("POST", "/users")
   *   .actions([hasSessionUser, hasAccess("users", "create")])
   *   .handle(async ({ name, email, sessionUserId }) => {
   *     // await db.users.insert({ name, email, createdBy: sessionUserId });
   *   })
   * ```
   */
  route<
    TMethod extends RouteMethod,
    TPath extends Extract<TRoutes[number], { state: { method: TMethod } }>["state"]["path"],
    TRoute extends Extract<TRoutes[number], { state: { method: TMethod; path: TPath } }>,
  >(method: TMethod, path: TPath): TRoute {
    const route = this.#index.get(`${method} ${path}`);
    if (route === undefined) {
      throw new Error(`Relay > Route not found at '${method} ${path}' index`);
    }
    return route as TRoute;
  }

  /*
   |--------------------------------------------------------------------------------
   | Client
   |--------------------------------------------------------------------------------
   */

  /**
   * Send a "POST" request through the relay `fetch` adapter.
   *
   * @param path - Path to send request to.
   * @param args - List of request arguments.
   */
  async post<
    TPath extends Extract<TRoutes[number], { state: { method: "POST" } }>["state"]["path"],
    TRoute extends Extract<TRoutes[number], { state: { method: "POST"; path: TPath } }>,
  >(path: TPath, ...args: TRoute["args"]): Promise<RelayResponse<TRoute>> {
    return this.#send("POST", path, args) as RelayResponse<TRoute>;
  }

  /**
   * Send a "GET" request through the relay `fetch` adapter.
   *
   * @param path - Path to send request to.
   * @param args - List of request arguments.
   */
  async get<
    TPath extends Extract<TRoutes[number], { state: { method: "GET" } }>["state"]["path"],
    TRoute extends Extract<TRoutes[number], { state: { method: "GET"; path: TPath } }>,
  >(path: TPath, ...args: TRoute["args"]): Promise<RelayResponse<TRoute>> {
    return this.#send("GET", path, args) as RelayResponse<TRoute>;
  }

  /**
   * Send a "PUT" request through the relay `fetch` adapter.
   *
   * @param path - Path to send request to.
   * @param args - List of request arguments.
   */
  async put<
    TPath extends Extract<TRoutes[number], { state: { method: "PUT" } }>["state"]["path"],
    TRoute extends Extract<TRoutes[number], { state: { method: "PUT"; path: TPath } }>,
  >(path: TPath, ...args: TRoute["args"]): Promise<RelayResponse<TRoute>> {
    return this.#send("PUT", path, args) as RelayResponse<TRoute>;
  }

  /**
   * Send a "PATCH" request through the relay `fetch` adapter.
   *
   * @param path - Path to send request to.
   * @param args - List of request arguments.
   */
  async patch<
    TPath extends Extract<TRoutes[number], { state: { method: "PATCH" } }>["state"]["path"],
    TRoute extends Extract<TRoutes[number], { state: { method: "PATCH"; path: TPath } }>,
  >(path: TPath, ...args: TRoute["args"]): Promise<RelayResponse<TRoute>> {
    return this.#send("PATCH", path, args) as RelayResponse<TRoute>;
  }

  /**
   * Send a "DELETE" request through the relay `fetch` adapter.
   *
   * @param path - Path to send request to.
   * @param args - List of request arguments.
   */
  async delete<
    TPath extends Extract<TRoutes[number], { state: { method: "DELETE" } }>["state"]["path"],
    TRoute extends Extract<TRoutes[number], { state: { method: "DELETE"; path: TPath } }>,
  >(path: TPath, ...args: TRoute["args"]): Promise<RelayResponse<TRoute>> {
    return this.#send("DELETE", path, args) as RelayResponse<TRoute>;
  }

  /*
   |--------------------------------------------------------------------------------
   | Server
   |--------------------------------------------------------------------------------
   */

  /**
   * Handle a incoming fetch request.
   *
   * @param request - Fetch request to pass to a route handler.
   */
  async handle(request: Request) {
    const url = new URL(request.url);

    const matched = this.#resolve(request.method, request.url);
    if (matched === undefined) {
      return toResponse(
        new NotFoundError(`Invalid routing path provided for ${request.url}`, {
          method: request.method,
          url: request.url,
        }),
      );
    }

    const { route, params } = matched;

    // ### Context
    // Context is passed to every route handler and provides a suite of functionality
    // and request data.

    const context = {
      ...params,
      ...toSearch(url.searchParams),
    };

    // ### Params
    // If the route has params we want to coerce the values to the expected types.

    if (route.state.params !== undefined) {
      const result = await route.state.params.safeParseAsync(context.params);
      if (result.success === false) {
        return toResponse(new BadRequestError("Invalid request params", z.prettifyError(result.error)));
      }
      context.params = result.data;
    }

    // ### Query
    // If the route has a query schema we need to validate and parse the query.

    if (route.state.search !== undefined) {
      const result = await route.state.search.safeParseAsync(context.query ?? {});
      if (result.success === false) {
        return toResponse(new BadRequestError("Invalid request query", z.prettifyError(result.error)));
      }
      context.query = result.data;
    }

    // ### Body
    // If the route has a body schema we need to validate and parse the body.

    const body: Record<string, unknown> = {};

    if (route.state.body !== undefined) {
      const result = await route.state.body.safeParseAsync(body);
      if (result.success === false) {
        return toResponse(new BadRequestError("Invalid request body", z.prettifyError(result.error)));
      }
      context.body = result.data;
    }

    // ### Actions
    // Run through all assigned actions for the route.

    if (route.state.actions !== undefined) {
      for (const action of route.state.actions) {
        const result = (await action.state.input?.safeParseAsync(context)) ?? { success: true, data: {} };
        if (result.success === false) {
          return toResponse(new BadRequestError("Invalid action input", z.prettifyError(result.error)));
        }
        const output = (await action.state.handle?.(result.data)) ?? {};
        for (const key in output) {
          context[key] = output[key];
        }
      }
    }

    // ### Handler
    // Execute the route handler and apply the result.

    return toResponse(await route.state.handle?.(context).catch((error) => error));
  }

  /**
   * Attempt to resolve a route based on the given method and pathname.
   *
   * @param method - HTTP method.
   * @param url    - HTTP request url.
   */
  #resolve(method: string, url: string): ResolvedRoute | undefined {
    this.#assertMethod(method);
    for (const route of this.routes[method]) {
      if (route.match(url) === true) {
        return { route, params: route.getParsedParams(url) };
      }
    }
  }

  #validateRoutePath(route: Route): void {
    const path = `${route.method} ${route.path}`;
    if (this.#paths.has(path)) {
      throw new Error(`Router > Path ${path} already exists`);
    }
    this.#paths.add(path);
  }

  async #send(method: RouteMethod, url: string, args: any[]) {
    const route = this.route(method, url);

    // ### Input

    const input: RequestInput = { method, url, search: "" };

    let index = 0; // argument incrementor

    if (route.state.params !== undefined) {
      const params = args[index++] as { [key: string]: string };
      for (const key in params) {
        input.url = input.url.replace(`:${key}`, params[key]);
      }
    }

    if (route.state.search !== undefined) {
      const search = args[index++] as { [key: string]: string };
      const pieces: string[] = [];
      for (const key in search) {
        pieces.push(`${key}=${search[key]}`);
      }
      if (pieces.length > 0) {
        input.search = `?${pieces.join("&")}`;
      }
    }

    if (route.state.body !== undefined) {
      input.body = JSON.stringify(args[index++]);
    }

    // ### Fetch

    const data = await this.config.adapter.fetch(input);
    if (route.state.output !== undefined) {
      return route.state.output.parse(data);
    }
    return data;
  }

  #assertMethod(method: string): asserts method is RouteMethod {
    if (!SUPPORTED_MEHODS.includes(method)) {
      throw new Error(`Router > Unsupported method '${method}'`);
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

/**
 * Sorting method for routes to ensure that static properties takes precedence
 * for when a route is matched against incoming requests.
 *
 * @param a - Route A
 * @param b - Route B
 */
function byStaticPriority(a: Route, b: Route) {
  const aSegments = a.path.split("/");
  const bSegments = b.path.split("/");

  const maxLength = Math.max(aSegments.length, bSegments.length);

  for (let i = 0; i < maxLength; i++) {
    const aSegment = aSegments[i] || "";
    const bSegment = bSegments[i] || "";

    const isADynamic = aSegment.startsWith(":");
    const isBDynamic = bSegment.startsWith(":");

    if (isADynamic !== isBDynamic) {
      return isADynamic ? 1 : -1;
    }

    if (isADynamic === false && aSegment !== bSegment) {
      return aSegment.localeCompare(bSegment);
    }
  }

  return a.path.localeCompare(b.path);
}

/**
 * Resolve and return query object from the provided search parameters, or undefined
 * if the search parameters does not have any entries.
 *
 * @param searchParams - Search params to create a query object from.
 */
function toSearch(searchParams: URLSearchParams): object | undefined {
  if (searchParams.size === 0) {
    return undefined;
  }
  const result: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * Takes a server side request result and returns a fetch Response.
 *
 * @param result - Result to send back as a Response.
 */
function toResponse(result: object | RelayError | Response | void): Response {
  if (result instanceof Response) {
    return result;
  }
  if (result instanceof RelayError) {
    return new Response(result.message, {
      status: result.status,
    });
  }
  if (result === undefined) {
    return new Response(null, { status: 204 });
  }
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Routes = {
  POST: Route[];
  GET: Route[];
  PUT: Route[];
  PATCH: Route[];
  DELETE: Route[];
};

type ResolvedRoute = {
  route: Route;
  params: any;
};

type RelayResponse<TRoute extends Route> = TRoute["state"]["output"] extends ZodType ? z.infer<TRoute["state"]["output"]> : void;

type RelayConfig = {
  adapter: RelayAdapter;
};

export type RelayAdapter = {
  fetch(input: RequestInput): Promise<unknown>;
};

export type RequestInput = {
  method: RouteMethod;
  url: string;
  search: string;
  body?: string;
};
