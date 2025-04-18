import z from "zod";

import { action } from "../../libraries/action.ts";

export const addTwoNumbers = action
  .make("addTwoNumbers")
  .input({ a: z.number(), b: z.number() })
  .output({ added: z.number() })
  .handle(async ({ a, b }) => {
    return {
      added: a + b,
    };
  });
