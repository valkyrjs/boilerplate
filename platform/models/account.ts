import { RoleSchema } from "@platform/spec/account/role.ts";
import { StrategySchema } from "@platform/spec/account/strategies.ts";
import { z } from "zod";

import { makeModelParser } from "./helpers/parser.ts";
import { AvatarSchema } from "./value-objects/avatar.ts";
import { ContactSchema } from "./value-objects/contact.ts";
import { NameSchema } from "./value-objects/name.ts";

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

export const toAccountDocument = makeModelParser(AccountSchema);
export const fromAccountDocument = makeModelParser(AccountSchema);

export type Account = z.infer<typeof AccountSchema>;
export type AccountDocument = z.infer<typeof AccountSchema>;
