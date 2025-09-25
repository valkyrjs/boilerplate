import { getDatabaseAccessor } from "@platform/database/accessor.ts";

import { parseWorkspace, type Workspace } from "./models/workspace.ts";
import type { WorkspaceUser } from "./models/workspace-user.ts";

export const db = getDatabaseAccessor<{
  workspaces: Workspace;
  "workspace:users": WorkspaceUser;
}>(`workspace:read-store`);

/*
 |--------------------------------------------------------------------------------
 | Identity
 |--------------------------------------------------------------------------------
 */

/**
 * Retrieve a single workspace by its primary identifier.
 *
 * @param id - Unique identity.
 */
export async function getWorkspaceById(id: string): Promise<Workspace | undefined> {
  return db
    .collection("workspaces")
    .findOne({ id })
    .then((document) => parseWorkspace(document));
}
