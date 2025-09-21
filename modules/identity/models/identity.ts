import { makeDocumentParser } from "@platform/database/utilities.ts";
import { z } from "zod";

import { AvatarSchema } from "../schemas/avatar.ts";
import { ContactSchema } from "../schemas/contact.ts";
import { NameSchema } from "../schemas/name.ts";
import { RoleSchema } from "../schemas/role.ts";
import { StrategySchema } from "../schemas/strategies.ts";

export const IdentitySchema = z.object({
  id: z.uuid(),
  avatar: AvatarSchema.optional(),
  name: NameSchema.optional(),
  contact: ContactSchema.default({
    emails: [],
  }),
  strategies: z.array(StrategySchema).default([]),
  roles: z.array(RoleSchema).default([]),
});

/*
 |--------------------------------------------------------------------------------
 | Parsers
 |--------------------------------------------------------------------------------
 */

export const parseIdentity = makeDocumentParser(IdentitySchema);

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Identity = z.infer<typeof IdentitySchema>;
