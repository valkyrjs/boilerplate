import { ResourceRegistry } from "@valkyr/auth";

export const resources = new ResourceRegistry([
  {
    kind: "identity",
    attr: {},
  },
  {
    kind: "workspace",
    attr: {},
  },
] as const);

export type Resource = typeof resources.$resource;
