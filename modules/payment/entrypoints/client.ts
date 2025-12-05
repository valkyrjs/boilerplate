export const ledger = {
  dashboard: (await import("../routes/dashboard/spec.ts")).default,
  benficiaries: {
    create: (await import("../routes/beneficiaries/create/spec.ts")).default,
    list: (await import("../routes/beneficiaries/list/spec.ts")).default,
    id: (await import("../routes/beneficiaries/:id/spec.ts")).default,
  },
  create: (await import("../routes/ledgers/create/spec.ts")).default,
};
