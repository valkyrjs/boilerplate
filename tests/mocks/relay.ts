import z from "zod";

import { http } from "../../adapters/http.ts";
import { Relay } from "../../libraries/relay.ts";
import { route } from "../../libraries/route.ts";
import { UserSchema } from "./user.ts";

export const relay = new Relay({ adapter: http }, [
  route
    .post("/users")
    .body(UserSchema.omit({ id: true }))
    .response(z.string()),
  route.get("/users").response(z.array(UserSchema)),
  route
    .get("/users/:userId")
    .params({ userId: z.string().check(z.uuid()) })
    .response(UserSchema.or(z.undefined())),
  route
    .put("/users/:userId")
    .params({ userId: z.string().check(z.uuid()) })
    .body(UserSchema.omit({ id: true })),
  route.delete("/users/:userId").params({ userId: z.string().check(z.uuid()) }),
]);
