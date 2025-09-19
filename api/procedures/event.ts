import { procedure } from "@platform/relay";
import z from "zod";

const EventSchema = z.object({
  id: z.uuid(),
  stream: z.uuid(),
  type: z.string(),
  data: z.any(),
  meta: z.any(),
  recorded: z.string(),
  created: z.string(),
});

export default procedure
  .method("event")
  .access("public")
  .params(EventSchema)
  .response(z.uuid())
  .handle(async (event) => {
    console.log(event);
    return crypto.randomUUID();
  });
