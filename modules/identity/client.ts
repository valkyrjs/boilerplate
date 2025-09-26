import { CheckResourcesResponse } from "@cerbos/core";
import { HttpAdapter, makeClient } from "@platform/relay";

import { config } from "./config.ts";
import checkResource from "./routes/access/check-resource/spec.ts";
import checkResources from "./routes/access/check-resources/spec.ts";
import isAllowed from "./routes/access/is-allowed/spec.ts";
import getById from "./routes/identities/get/spec.ts";
import loginByPassword from "./routes/login/code/spec.ts";
import loginByEmail from "./routes/login/email/spec.ts";
import loginByCode from "./routes/login/password/spec.ts";
import me from "./routes/me/spec.ts";

const adapter = new HttpAdapter({
  url: config.url,
});

const access = makeClient(
  {
    adapter,
  },
  {
    isAllowed,
    checkResource,
    checkResources,
  },
);

export const identity = makeClient(
  {
    adapter,
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

    access: {
      /**
       * Check if a principal is allowed to perform an action on a resource.
       *
       * @param resource - Resource which we are validating.
       * @param action   - Action which we are validating.
       *
       * @example
       *
       * await access.isAllowed(
       *   {
       *     kind: "document",
       *     id: "1",
       *     attr: { owner: "user@example.com" },
       *   },
       *   "view"
       * ); // => true
       */
      isAllowed: async (resource: Resource, action: string) => {
        const response = await access.isAllowed({ body: { resource, action } });
        if ("error" in response) {
          throw response.error;
        }
        return response.data;
      },

      /**
       * Check a principal's permissions on a resource.
       *
       * @param resource - Resource which we are validating.
       * @param actions  - Actions which we are validating.
       *
       * @example
       *
       * const decision = await access.checkResource(
       *   {
       *     kind: "document",
       *     id: "1",
       *     attr: { owner: "user@example.com" },
       *   },
       *   ["view", "edit"],
       * );
       *
       * decision.isAllowed("view"); // => true
       */
      checkResource: async (resource: Resource, actions: string[]) => {
        const response = await access.checkResource({ body: { resource, actions } });
        if ("error" in response) {
          throw response.error;
        }
        return new CheckResourcesResponse(response.data);
      },

      /**
       * Check a principal's permissions on a set of resources.
       *
       * @param resources - Resources which we are validating.
       *
       * @example
       *
       * const decision = await access.checkResources([
       *   {
       *     resource: {
       *       kind: "document",
       *       id: "1",
       *       attr: { owner: "user@example.com" },
       *     },
       *     actions: ["view", "edit"],
       *   },
       *   {
       *     resource: {
       *       kind: "image",
       *       id: "1",
       *       attr: { owner: "user@example.com" },
       *     },
       *     actions: ["delete"],
       *   },
       * ]);
       *
       * decision.isAllowed({
       *   resource: { kind: "document", id: "1" },
       *   action: "view",
       * }); // => true
       */
      checkResources: async (resources: { resource: Resource; actions: string[] }[]) => {
        const response = await access.checkResources({ body: resources });
        if ("error" in response) {
          throw response.error;
        }
        return new CheckResourcesResponse(response.data);
      },
    },
  },
);

type Resource = {
  kind: string;
  id: string;
  attr: Record<string, any>;
};
