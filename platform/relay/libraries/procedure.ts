import type z from "zod";
import type { ZodType } from "zod";

import type { ServerContext } from "./context.ts";
import type { ServerError, ServerErrorClass } from "./errors.ts";
import type { RouteAccess } from "./route.ts";

export class Procedure<const TState extends State = State> {
  readonly type = "procedure" as const;

  declare readonly $params: TState["params"] extends ZodType ? z.input<TState["params"]> : never;
  declare readonly $response: TState["response"] extends ZodType ? z.output<TState["response"]> : never;

  /**
   * Instantiate a new Procedure instance.
   *
   * @param state - Procedure state.
   */
  constructor(readonly state: TState) {}

  /**
   * Procedure method value.
   */
  get method(): State["method"] {
    return this.state.method;
  }

  /**
   * Access level of the procedure which acts as the first barrier of entry
   * to ensure that requests are valid.
   *
   * By default on the server the lack of access definition will result
   * in an error as all procedures needs an access definition.
   *
   * @param access - Access level of the procedure.
   *
   * @examples
   *
   * ```ts
   * procedure
   *   .method("users:create")
   *   .access("public")
   *   .handle(async () => {
   *     // ...
   *   });
   *
   * procedure
   *   .method("users:get-by-id")
   *   .access("session")
   *   .params(z.string())
   *   .handle(async (userId, context) => {
   *     if (userId !== context.session.userId) {
   *       return new ForbiddenError("Cannot read other users details.");
   *     }
   *   });
   *
   * procedure
   *   .method("users:update")
   *   .access([resource("users", "update")])
   *   .params(z.array(z.string(), z.object({ name: z.string() })))
   *   .handle(async ([userId, payload], context) => {
   *     if (userId !== context.session.userId) {
   *       return new ForbiddenError("Cannot update other users details.");
   *     }
   *     console.log(userId, payload); // => string, { name: string }
   *   });
   * ```
   */
  access<TAccess extends RouteAccess>(access: TAccess): Procedure<Omit<TState, "access"> & { access: TAccess }> {
    return new Procedure({ ...this.state, access: access as TAccess });
  }

  /**
   * Defines the payload forwarded to the handler.
   *
   * @param params - Method payload.
   *
   * @examples
   *
   * ```ts
   * procedure
   *   .method("users:create")
   *   .access([resource("users", "create")])
   *   .params(z.object({
   *     name: z.string(),
   *     email: z.email(),
   *   }))
   *   .handle(async ({ name, email }, context) => {
   *     return { name, email, createdBy: context.session.userId };
   *   });
   * ```
   */
  params<TParams extends ZodType>(params: TParams): Procedure<Omit<TState, "params"> & { params: TParams }> {
    return new Procedure({ ...this.state, params });
  }

  /**
   * Instances of the possible error responses this procedure produces.
   *
   * @param errors - Error shapes of the procedure.
   *
   * @examples
   *
   * ```ts
   * procedure
   *   .method("users:list")
   *   .errors([
   *     BadRequestError
   *   ])
   *   .handle(async () => {
   *     return new BadRequestError();
   *   });
   * ```
   */
  errors<TErrors extends ServerErrorClass[]>(errors: TErrors): Procedure<Omit<TState, "errors"> & { errors: TErrors }> {
    return new Procedure({ ...this.state, errors });
  }

  /**
   * Shape of the success response this procedure produces. This is used by the transform
   * tools to ensure the client receives parsed data.
   *
   * @param response - Response shape of the procedure.
   *
   * @examples
   *
   * ```ts
   * procedure
   *   .post("users:list")
   *   .response(
   *     z.array(
   *       z.object({
   *        name: z.string()
   *      }),
   *     )
   *   )
   *   .handle(async () => {
   *     return [{ name: "John Doe" }];
   *   });
   * ```
   */
  response<TResponse extends ZodType>(
    response: TResponse,
  ): Procedure<Omit<TState, "response"> & { response: TResponse }> {
    return new Procedure({ ...this.state, response });
  }

  /**
   * Server handler callback method.
   *
   * Handler receives the params, query, body, actions in order of definition.
   * So if your route has params, and body the route handle method will
   * receive (params, body) as arguments.
   *
   * @param handle - Handle function to trigger when the route is executed.
   *
   * @examples
   *
   * ```ts
   * procedure
   *   .method("users:list")
   *   .response(
   *     z.array(
   *       z.object({
   *        name: z.string()
   *      }),
   *     )
   *   )
   *   .handle(async () => {
   *     return [{ name: "John Doe" }];
   *   });
   * ```
   */
  handle<THandleFn extends HandleFn<ServerArgs<TState>, TState["response"]>>(
    handle: THandleFn,
  ): Procedure<Omit<TState, "handle"> & { handle: THandleFn }> {
    return new Procedure({ ...this.state, handle });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Factories
 |--------------------------------------------------------------------------------
 */

/**
 * Route factories allowing for easy generation of relay compliant routes.
 */
export const procedure: {
  /**
   * Create a new procedure with given method name.
   *
   * @param method Name of the procedure used to match requests against.
   *
   * @examples
   *
   * ```ts
   * procedure
   *   .method("users:get-by-id")
   *   .params(
   *     z.string().describe("Users unique identifier")
   *   );
   * ```
   */
  method<TMethod extends string>(method: TMethod): Procedure<{ method: TMethod }>;
} = {
  method<TMethod extends string>(method: TMethod) {
    return new Procedure({ method });
  },
};

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Procedures = {
  [key: string]: Procedures | Procedure;
};

type State = {
  method: string;
  access?: RouteAccess;
  params?: ZodType;
  errors?: ServerErrorClass[];
  response?: ZodType;
  handle?: HandleFn;
};

type HandleFn<TArgs extends Array<any> = any[], TResponse = any> = (
  ...args: TArgs
) => TResponse extends ZodType
  ? Promise<z.infer<TResponse> | Response | ServerError>
  : Promise<Response | ServerError | void>;

type ServerArgs<TState extends State> = HasInputArgs<TState> extends true
  ? [z.output<TState["params"]>, ServerContext]
  : [ServerContext];

type HasInputArgs<TState extends State> = TState["params"] extends ZodType ? true : false;
