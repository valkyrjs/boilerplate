import { makeDocumentParser } from "@platform/database/utilities.ts";
import { z } from "zod";

export const WorkspaceSchema = z.object({
  id: z.uuid(),

  ownerId: z.uuid(),

  name: z.string(),
  description: z.string().optional(),

  createdAt: z.coerce.date(),
  createdBy: z.string(),
  updatedAt: z.coerce.date().optional(),
  updatedBy: z.string().optional(),
});

/*
 |--------------------------------------------------------------------------------
 | Parsers
 |--------------------------------------------------------------------------------
 */

export const parseWorkspace = makeDocumentParser(WorkspaceSchema);

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Workspace = z.infer<typeof WorkspaceSchema>;
