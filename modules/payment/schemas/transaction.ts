import z from "zod";

import { TransactionParticipantType } from "./transaction-participant.ts";

/*
 |--------------------------------------------------------------------------------
 | Transaction
 |--------------------------------------------------------------------------------
 |
 | A transaction is a description of value being moved from a source to a target.
 | Transaction must have at least one "account" participant or it is considered
 | invalid as our system does not support "external" -> "external" transactions.
 |
 | Which ledger the transaction resides in is determined by the participants
 | account traced upwards tx -> account -> wallet -> ledger. A transaction is
 | invalid if both source and target participant account leads to different
 | ledgers.
 |
 */

export const TransactionSchema = z.strictObject({
  _id: z.uuid().describe("Primary identifier of the transaction"),

  sourceType: TransactionParticipantType,
  sourceId: z.string().describe("Identifier of the source sending value"),

  targetType: TransactionParticipantType,
  targetId: z.string().describe("Identifier of the target receiving value"),

  amount: z.string().describe("Value amount being transferred"),
  conversionRate: z
    .number()
    .optional()
    .describe("Conversation rate from source to target if they operate in different currencies"),

  occurredAt: z.coerce.date().describe("Timestamp of when the transaction occured"),
  approvedBy: z.string().describe("Identifier of the individual who approved the transfer"),
});

export type Transaction = z.output<typeof TransactionSchema>;
