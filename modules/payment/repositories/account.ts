import { db } from "@platform/database";
import { BadRequestError, ConflictError } from "@platform/relay";

import { type Account, type AccountInsert, AccountInsertSchema, AccountSchema } from "../schemas/account.ts";
import { getLedgerById } from "./ledger.ts";
import { getWalletById } from "./wallet.ts";

/**
 * Create a new account.
 *
 * @param values - Account values to insert.
 */
export async function createAccount(values: AccountInsert): Promise<string> {
  return db
    .begin(async () => {
      const _id = crypto.randomUUID();

      // const wallet = await getWalletById(values.walletId);
      // if (wallet === undefined) {
      //   throw new ConflictError(`Wallet '${values.walletId}' does not exist`);
      // }

      // const ledger = await getLedgerById(wallet.ledgerId);
      // if (ledger === undefined) {
      //   // TODO: RAISE ALARMS, THIS SHOULD NEVER OCCUR
      //   throw new ConflictError(`Wallet ledger '${wallet.ledgerId}' does not exist`);
      // }

      // if (ledger.currencies.includes(values.currency) === false) {
      //   throw new BadRequestError(
      //     `Ledger does not support '${values.currency}' currency, supported currencies '${ledger.currencies.join(", ")}'`,
      //   );
      // }

      // Assert wallet exists
      await db.sql`
        ASSERT EXISTS (
          SELECT 1 
          FROM payment.wallet w
          WHERE w._id = ${db.text(values.walletId)}
        ), 'missing_wallet';
      `;

      // Assert wallet → ledger relationship exists AND ledger exists
      await db.sql`
        ASSERT EXISTS (
          SELECT 1
          FROM payment.wallet w
          JOIN payment.ledger l ON l._id = w."ledgerId"
          WHERE w._id = ${db.text(values.walletId)}
        ), 'missing_ledger';
      `;

      // Assert ledger supports the currency
      await db.sql`
        ASSERT EXISTS (
          SELECT 1
          FROM payment.wallet w
          JOIN payment.ledger l ON l._id = w."ledgerId"
          WHERE w._id = ${db.text(values.walletId)}
            AND ${db.text(values.currency)} = ANY(l.currencies)
        ), 'unsupported_currency';
      `;

      await db.sql`INSERT INTO payment.wallet RECORDS ${db.transit({ _id, ...AccountInsertSchema.parse(values) })}`;

      return _id;
    })
    .catch((error) => {
      if (error instanceof Error === false) {
        throw error;
      }
      switch (error.message) {
        case "missing_wallet": {
          throw new ConflictError("Account wallet does not exist");
        }
        case "missing_ledger": {
          throw new ConflictError("Account ledger does not exist");
        }
        case "unsupported_currency": {
          throw new ConflictError("Invalid account currency");
        }
      }
      throw error;
    });
}

export async function getAccountsByWalletId(walletId: string): Promise<Account[]> {
  return db.schema(AccountSchema).many`
    SELECT
      *, _system_from as "createdAt"
    FROM
      payment.wallet
    WHERE
      "walletId" = ${walletId}
  `;
}
