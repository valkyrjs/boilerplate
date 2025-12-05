import z from "zod";

import { CurrencySchema } from "./currency.ts";

/*
 |--------------------------------------------------------------------------------
 | Account
 |--------------------------------------------------------------------------------
 |
 | An account is a entity which can be the sender or recipient in a transaction.
 |
 */

export const AccountSchema = z.strictObject({
  _id: z.uuid().describe("Primary identifier of the account"),
  walletId: z.string().describe("Identifier of the wallet this account belongs to"),
  label: z.string().describe("Human-readable name for the account"),
  currency: CurrencySchema.describe("Currency this account trades in"),
});

export type Account = z.output<typeof AccountSchema>;

/*
 |--------------------------------------------------------------------------------
 | Database
 |--------------------------------------------------------------------------------
 */

export const AccountInsertSchema = z.strictObject({
  walletId: AccountSchema.shape.walletId,
  label: z.string().nullable().default(null).describe("Human-readable identifier for the account"),
  currency: AccountSchema.shape.currency,
});

export type AccountInsert = z.input<typeof AccountInsertSchema>;
