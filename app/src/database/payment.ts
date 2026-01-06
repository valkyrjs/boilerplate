import {
  AccountSchema,
  BeneficiarySchema,
  LedgerSchema,
  TransactionSchema,
  WalletSchema,
} from "@module/payment/client";
import { IndexedDB } from "@valkyr/db";

import { api } from "@/services/api.ts";

export const payment = new IndexedDB({
  name: "valkyr-sandbox:payment",
  registrars: [
    {
      name: "account",
      schema: AccountSchema.shape,
      indexes: [
        {
          field: "_id",
          kind: "primary",
        },
        {
          field: "walletId",
          kind: "shared",
        },
      ],
    },
    {
      name: "beneficiary",
      schema: BeneficiarySchema.shape,
      indexes: [
        {
          field: "_id",
          kind: "primary",
        },
        {
          field: "tenantId",
          kind: "shared",
        },
      ],
    },
    {
      name: "ledger",
      schema: LedgerSchema.shape,
      indexes: [
        {
          field: "_id",
          kind: "primary",
        },
        {
          field: "beneficiaryId",
          kind: "shared",
        },
      ],
    },
    {
      name: "transaction",
      schema: TransactionSchema.shape,
      indexes: [
        {
          field: "_id",
          kind: "primary",
        },
      ],
    },
    {
      name: "wallet",
      schema: WalletSchema.shape,
      indexes: [
        {
          field: "_id",
          kind: "primary",
        },
        {
          field: "ledgerId",
          kind: "shared",
        },
      ],
    },
  ] as const,
});

export async function loadBeneficiaries(): Promise<void> {
  const result = await api.payment.benficiaries.list();
  if ("data" in result) {
    payment.collection("beneficiary").insert(result.data);
  }
}
