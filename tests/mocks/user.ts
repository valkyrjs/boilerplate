import z from "zod";

export const UserSchema = z.object({
  id: z.string().check(z.uuid()),
  name: z.string(),
  email: z.string().check(z.email()),
});

export type User = z.infer<typeof UserSchema>;
