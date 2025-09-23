export default {
  routes: [
    (await import("./routes/identities/get/handle.ts")).default,
    (await import("./routes/identities/update/handle.ts")).default,
    (await import("./routes/login/code/handle.ts")).default,
    (await import("./routes/login/email/handle.ts")).default,
    // (await import("./routes/login/password/handle.ts")).default,
    (await import("./routes/login/sudo/handle.ts")).default,
    (await import("./routes/me/handle.ts")).default,
    (await import("./routes/roles/handle.ts")).default,
  ],
};
