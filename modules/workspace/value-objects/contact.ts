import z from "zod";

import { EmailSchema } from "./email.ts";

export const ContactSchema = z.union([
  z.object({
    id: z.string(),
    type: z.literal("email"),
    email: EmailSchema,
  }),
]);

export type Contact = z.infer<typeof ContactSchema>;
