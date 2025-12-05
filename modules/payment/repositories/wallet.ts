import { db } from "@platform/database";
import { ConflictError } from "@platform/relay";

import { type Wallet, type WalletInsert, WalletInsertSchema, WalletSchema } from "../schemas/wallet.ts";

/**
 * Create a new wallet.
 *
 * @param values - Wallet values to insert.
 */
export async function createWallet(values: WalletInsert): Promise<string> {
  return db
    .begin(async () => {
      const _id = crypto.randomUUID();
      await db.sql`ASSERT EXISTS (SELECT 1 FROM payment.ledger WHERE _id = ${db.text(values.ledgerId)}), 'missing_ledger'`;
      await db.sql`INSERT INTO payment.wallet RECORDS ${db.transit({ _id, ...WalletInsertSchema.parse(values) })}`;
      return _id;
    })
    .catch((error) => {
      if (error instanceof Error && error.message === "missing_beneficiary") {
        throw new ConflictError(`Ledger '${values.ledgerId}' does not exist`);
      }
      throw error;
    });
}

export async function getWalletsByLedgerId(ledgerId: string): Promise<Wallet[]> {
  return db.schema(WalletSchema).many`
    SELECT
      *, _system_from as "createdAt"
    FROM
      payment.wallet
    WHERE
      "ledgerId" = ${ledgerId}
  `;
}

export async function getWalletById(id: string): Promise<Wallet | undefined> {
  return db.schema(WalletSchema).one`
    SELECT
      *, _system_from as "createdAt"
    FROM
      payment.wallet
    WHERE
      _id = ${id}
  `;
}
