import { ResourceRegistry } from "@valkyr/auth";

export const resources = new ResourceRegistry([
  {
    kind: "identity",
    attr: {},
  },
] as const);

export type Resource = typeof resources.$resource;
