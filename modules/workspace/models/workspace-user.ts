import { makeDocumentParser } from "@platform/database/utilities.ts";
import { z } from "zod";

import { AvatarSchema } from "../value-objects/avatar.ts";
import { ContactSchema } from "../value-objects/contact.ts";
import { NameSchema } from "../value-objects/name.ts";

export const WorkspaceUserSchema = z.object({
  id: z.uuid(),

  workspaceId: z.uuid(),
  identityId: z.string(),

  name: NameSchema.optional(),
  avatar: AvatarSchema.optional(),
  contacts: z.array(ContactSchema).default([]),

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

export const parseWorkspaceUser = makeDocumentParser(WorkspaceUserSchema);

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type WorkspaceUser = z.infer<typeof WorkspaceUserSchema>;
