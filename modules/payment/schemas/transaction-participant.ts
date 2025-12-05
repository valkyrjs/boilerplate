import z from "zod";

/*
 |--------------------------------------------------------------------------------
 | Transaction Participant
 |--------------------------------------------------------------------------------
 |
 | A participant is either an internal account or an external entity.
 |
 */

export const TransactionParticipantType = z.union([
  z.literal("account").describe("Participant is an internal account on the ledger"),
  z.literal("external").describe("Participant is a opaque external entity"),
]);

export type TransactionParticipant = z.output<typeof TransactionParticipantType>;
