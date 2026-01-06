import { db } from "@platform/database";
import { BadRequestError } from "@platform/relay";

import { type Account, type AccountInsert, AccountInsertSchema, AccountSchema } from "../schemas/account.ts";

/**
 * Create a new account.
 *
 * @param values - Account values to insert.
 *
 * @returns Account _id
 */
export async function createAccount(values: AccountInsert): Promise<string> {
  return db
    .begin(async () => {
      const _id = crypto.randomUUID();

      // ### Assert Wallet
      // Ensure that the wallet we are creating an account for exists.

      await db.sql`
        ASSERT EXISTS (
          SELECT 
            1 
          FROM 
            payment.wallet wallet 
          WHERE 
            wallet._id = ${db.text(values.walletId)}
        ),
        'missing_wallet';
      `;

      // ### Assert Wallet → Ledger
      // Ensure that the wallet is related to a existing ledger.

      await db.sql`
        ASSERT EXISTS (
          SELECT 
            1
          FROM 
            payment.wallet wallet
          JOIN 
            payment.ledger ledger ON ledger._id = wallet."ledgerId"
          WHERE 
            wallet._id = ${db.text(values.walletId)}
        ),
        'missing_ledger';
      `;

      // ### Assert Currency
      // Ensure that the account currency is supported by the ledger.

      await db.sql`
        ASSERT EXISTS (
          SELECT 
            1
          FROM 
            payment.wallet wallet
          JOIN 
            payment.ledger ledger ON ledger._id = wallet."ledgerId"
          WHERE 
            wallet._id = ${db.text(values.walletId)}
          AND 
            ${db.text(values.currency)} IN (
              SELECT
                currency
              FROM
                UNNEST(ledger.currencies) AS x(currency)
            )
        ),
        'unsupported_currency';
      `;

      // ### Create Account

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

/**
 * Get all accounts registered for a wallet.
 *
 * @param walletId - Wallet to fetch accounts from.
 *
 * @returns List of wallet accounts
 */
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
