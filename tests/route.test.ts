import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { relay } from "./mocks/relay.ts";

describe("Relay", () => {
  it("should create a new user", async () => {
    const userId = await relay.post("/users", { name: "John Doe", email: "john.doe@fixture.none" });

    console.log({ userId });

    assertEquals(typeof userId, "string");
  });
});
