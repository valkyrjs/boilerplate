export * from "../schemas/account.ts";
export * from "../schemas/beneficiary.ts";
export * from "../schemas/currency.ts";
export * from "../schemas/ledger.ts";
export * from "../schemas/transaction.ts";
export * from "../schemas/transaction-participant.ts";
export * from "../schemas/wallet.ts";

export const payment = {
  dashboard: (await import("../routes/dashboard/spec.ts")).default,
  benficiaries: {
    create: (await import("../routes/beneficiaries/create/spec.ts")).default,
    list: (await import("../routes/beneficiaries/list/spec.ts")).default,
    id: (await import("../routes/beneficiaries/:id/spec.ts")).default,
    ledgers: (await import("../routes/beneficiaries/ledgers/spec.ts")).default,
  },
  ledger: {
    create: (await import("../routes/ledgers/create/spec.ts")).default,
  },
};
