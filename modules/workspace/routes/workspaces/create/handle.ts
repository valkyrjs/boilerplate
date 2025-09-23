import { ForbiddenError } from "@platform/relay";

import { Workspace } from "../../../aggregates/workspace.ts";
import { eventStore } from "../../../event-store.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ body: { name } }, { access, principal }) => {
  const decision = await access.isAllowed({ kind: "workspace", id: "1", attr: {} }, "create");
  if (decision === false) {
    return new ForbiddenError("You do not have permission to create workspaces.");
  }
  const workspace = await eventStore.aggregate.from(Workspace).create(principal.id, name).save();
  return {
    id: workspace.id,
    ownerId: workspace.ownerId,
    name: workspace.name,
    createdAt: workspace.createdAt,
    createdBy: principal.id,
  };
});
