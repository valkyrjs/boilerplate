import { cerbos } from "@platform/cerbos/client.ts";
import { Resource } from "@platform/cerbos/resources.ts";

import type { Principal } from "./principal.ts";

export function access(principal: Principal) {
  return {
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
    isAllowed(resource: Resource, action: string) {
      return cerbos.isAllowed({ principal, resource, action });
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
    checkResource(resource: Resource, actions: string[]) {
      return cerbos.checkResource({ principal, resource, actions });
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
    checkResources(resources: { resource: Resource; actions: string[] }[]) {
      return cerbos.checkResources({ principal, resources });
    },
  };
}

export type Access = ReturnType<typeof access>;
