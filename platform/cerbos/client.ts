import { HTTP } from "@cerbos/http";

export const cerbos = new HTTP("http://localhost:3592", {
  adminCredentials: {
    username: "cerbos",
    password: "cerbosAdmin",
  },
});
