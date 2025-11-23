export const account = {
  create: (await import("./routes/create/spec.ts")).default,
  get: (await import("./routes/get/spec.ts")).default,
};
