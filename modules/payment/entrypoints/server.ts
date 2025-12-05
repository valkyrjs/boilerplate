export default {
  routes: [
    (await import("../routes/dashboard/handle.ts")).default,
    (await import("../routes/beneficiaries/create/handle.ts")).default,
    (await import("../routes/beneficiaries/list/handle.ts")).default,
    (await import("../routes/beneficiaries/:id/handle.ts")).default,
    (await import("../routes/beneficiaries/ledgers/handle.ts")).default,
    (await import("../routes/ledgers/create/handle.ts")).default,
    (await import("../routes/ledgers/wallets/handle.ts")).default,
    (await import("../routes/wallets/create/handle.ts")).default,
    (await import("../routes/wallets/accounts/handle.ts")).default,
    (await import("../routes/accounts/create/handle.ts")).default,
  ],
};
