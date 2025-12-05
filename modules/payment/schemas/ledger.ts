import z from "zod";

import { CurrencySchema } from "./currency.ts";

/*
 |--------------------------------------------------------------------------------
 | Ledger
 |--------------------------------------------------------------------------------
 |
 | A ledger is the primary container in which transactions are held.
 |
 */

export const LedgerSchema = z.strictObject({
  _id: z.uuid().describe("Primary identifier of the ledger"),
  beneficiaryId: z.uuid().describe("Identifier of the beneficiary this ledger belongs to"),
  label: z.string().optional().describe("Human-readable identifier for the ledger"),
  currencies: z.array(CurrencySchema).describe("Currency this ledger trades in"),
  createdAt: z.coerce.date().describe("Timestamp the ledger was created"),
});

export type Ledger = z.output<typeof LedgerSchema>;

/*
 |--------------------------------------------------------------------------------
 | Database
 |--------------------------------------------------------------------------------
 */

export const LedgerInsertSchema = z.strictObject({
  beneficiaryId: LedgerSchema.shape.beneficiaryId,
  label: z.string().nullable().default(null).describe("Human-readable identifier for the ledger"),
  currencies: LedgerSchema.shape.currencies,
});

export type LedgerInsert = z.input<typeof LedgerInsertSchema>;
