import { makeDocumentParser } from "@platform/database/utilities.ts";
import z from "zod";

export enum PrincipalTypeId {
  User = 1,
  Group = 2,
  Other = 99,
}

export const PRINCIPAL_TYPE_NAMES = {
  [PrincipalTypeId.User]: "User",
  [PrincipalTypeId.Group]: "Group",
  [PrincipalTypeId.Other]: "Other",
};

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const PrincipalSchema = z.object({
  id: z.string(),
  type: z.strictObject({
    id: z.enum(PrincipalTypeId),
    name: z.string(),
  }),
  roles: z.array(z.string()),
  attr: z.record(z.string(), z.any()),
});

/*
 |--------------------------------------------------------------------------------
 | Parsers
 |--------------------------------------------------------------------------------
 */

export const parsePrincipal = makeDocumentParser(PrincipalSchema);

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Principal = z.infer<typeof PrincipalSchema>;
