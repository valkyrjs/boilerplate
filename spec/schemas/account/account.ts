import { z } from "zod";

import { AvatarSchema } from "../avatar.ts";
import { ContactSchema } from "../contact.ts";
import { makeSchemaParser } from "../database.ts";
import { NameSchema } from "../name.ts";
import { RoleSchema } from "./role.ts";
import { StrategySchema } from "./strategies.ts";

export const AccountSchema = z.object({
  id: z.uuid(),
  avatar: AvatarSchema.optional(),
  name: NameSchema.optional(),
  contact: ContactSchema.default({
    emails: [],
  }),
  strategies: z.array(StrategySchema).default([]),
  roles: z.array(RoleSchema).default([]),
});

export const toAccountDocument = makeSchemaParser(AccountSchema);
export const fromAccountDocument = makeSchemaParser(AccountSchema);

export type Account = z.infer<typeof AccountSchema>;
export type AccountDocument = z.infer<typeof AccountSchema>;
