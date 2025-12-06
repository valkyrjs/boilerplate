import type { Account, Beneficiary, Ledger, Transaction, Wallet } from "@module/payment/client";
import { IndexedDatabase } from "@valkyr/db";

import { api } from "@/services/api.ts";

export const payment = new IndexedDatabase<{
  account: Account;
  beneficiary: Beneficiary;
  ledger: Ledger;
  transaction: Transaction;
  wallet: Wallet;
}>({
  name: "valkyr-sandbox:payment",
  registrars: [
    {
      name: "account",
      indexes: [["_id", { unique: true }], ["walletId"]],
    },
    {
      name: "beneficiary",
      indexes: [["_id", { unique: true }], ["tenantId"]],
    },
    {
      name: "ledger",
      indexes: [["_id", { unique: true }], ["beneficiaryId"]],
    },
    {
      name: "transaction",
      indexes: [["_id", { unique: true }]],
    },
    {
      name: "wallet",
      indexes: [["_id", { unique: true }], ["ledgerId"]],
    },
  ],
});

export async function loadBeneficiaries(): Promise<void> {
  const result = await api.payment.benficiaries.list();
  if ("data" in result) {
    payment.collection("beneficiary").insertMany(result.data);
  }
}
