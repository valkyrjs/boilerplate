import { db } from "@platform/database";
import { BadRequestError } from "@platform/relay";

import { type Account, type AccountInsert, AccountInsertSchema, AccountSchema } from "../schemas/account.ts";

/**
 * Create a new account.
 *
 * @param values - Account values to insert.
 */
export async function createAccount(values: AccountInsert): Promise<string> {
  return db
    .begin(async () => {
      const _id = crypto.randomUUID();

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
            AND ${db.text(values.currency)} IN (
              SELECT
                currency
              FROM
                UNNEST(l.currencies) AS x(currency)
            )
        ), 'unsupported_currency';
      `;

      await db.sql`INSERT INTO payment.account RECORDS ${db.transit({ _id, ...AccountInsertSchema.parse(values) })}`;

      return _id;
    })
    .catch((error) => {
      if (error instanceof Error === false) {
        throw error;
      }
      switch (error.message) {
        case "missing_wallet": {
          throw new BadRequestError("Account wallet does not exist");
        }
        case "missing_ledger": {
          throw new BadRequestError("Account ledger does not exist");
        }
        case "unsupported_currency": {
          throw new BadRequestError("Invalid account currency");
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
