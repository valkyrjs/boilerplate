import { ResourceRegistry } from "@valkyr/auth";

export const resources = new ResourceRegistry([
  {
    kind: "account",
    attributes: {},
  },
] as const);

export type Resource = typeof resources.$resource;
