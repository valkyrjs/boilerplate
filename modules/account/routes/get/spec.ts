import { route } from "@platform/relay";
import z from "zod";

export default route.get("/api/v1/account/:number").params({
  number: z.number().describe("Account number to retrieve"),
});
