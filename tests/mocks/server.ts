import { relay } from "./relay.ts";
import { User } from "./user.ts";

export let users: User[] = [];

relay.route("POST", "/users").handle(async ({ name, email }) => {
  const id = crypto.randomUUID();
  users.push({ id, name, email });
  return id;
});

relay.route("GET", "/users").handle(async () => {
  return users;
});

relay.route("GET", "/users/:userId").handle(async ({ userId }) => {
  return users.find((user) => user.id === userId);
});

relay.route("PUT", "/users/:userId").handle(async ({ userId, name, email }) => {
  for (const user of users) {
    if (user.id === userId) {
      user.name = name;
      user.email = email;
      break;
    }
  }
});

relay.route("DELETE", "/users/:userId").handle(async ({ userId }) => {
  users = users.filter((user) => user.id === userId);
});
