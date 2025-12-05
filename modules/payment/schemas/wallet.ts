import z from "zod";

/*
 |--------------------------------------------------------------------------------
 | Wallet
 |--------------------------------------------------------------------------------
 |
 | A wallet can hold one or more accounts and is a complete overview of entities
 | funds in a ledger.
 |
 */

export const WalletSchema = z.strictObject({
  _id: z.uuid().describe("Primary identifier of the wallet"),
  ledgerId: z.uuid().describe("Identifier of the ledger this wallet belongs to"),
  entityId: z.string().describe("Identifier of the entity this wallet belongs to"),
  label: z.string().optional().describe("Human-readable identifier for the wallet"),
  createdAt: z.coerce.date().describe("Timestamp the wallet was created"),
});

export type Wallet = z.output<typeof WalletSchema>;

/*
 |--------------------------------------------------------------------------------
 | Database
 |--------------------------------------------------------------------------------
 */

export const WalletInsertSchema = z.strictObject({
  ledgerId: WalletSchema.shape.ledgerId,
  entityId: WalletSchema.shape.entityId,
  label: z.string().nullable().default(null).describe("Human-readable identifier for the wallet"),
});

export type WalletInsert = z.input<typeof WalletInsertSchema>;
