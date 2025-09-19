import { cerbos } from "./cerbos.ts";
import type { Principal } from "./principal.ts";
import { Resource } from "./resources.ts";

export function access(principal: Principal) {
  return {
    isAllowed(resource: Resource, action: string) {
      return cerbos.isAllowed({ principal, resource, action });
    },
    checkResource(resource: Resource, actions: string[]) {
      return cerbos.checkResource({ principal, resource, actions });
    },
    checkResources(resources: { resource: Resource; actions: string[] }[]) {
      return cerbos.checkResources({ principal, resources });
    },
  };
}

export type Access = ReturnType<typeof access>;
