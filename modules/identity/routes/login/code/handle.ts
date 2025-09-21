import { logger } from "@platform/logger";
import cookie from "cookie";

import { Code } from "../../../aggregates/code.ts";
import { Identity } from "../../../aggregates/identity.ts";
import { auth } from "../../../auth.ts";
import { config } from "../../../config.ts";
import { eventStore } from "../../../event-store.ts";
import route from "./spec.ts";

export default route.access("public").handle(async ({ params: { identityId, codeId, value }, query: { next } }) => {
  const code = await eventStore.aggregate.getByStream(Code, codeId);

  if (code === undefined) {
    return logger.info({
      type: "code:claimed",
      session: false,
      message: "Invalid Code ID",
      received: codeId,
    });
  }

  if (code.claimedAt !== undefined) {
    return logger.info({
      type: "code:claimed",
      session: false,
      message: "Code Already Claimed",
      received: codeId,
    });
  }

  await code.claim().save();

  if (code.value !== value) {
    return logger.info({
      type: "code:claimed",
      session: false,
      message: "Invalid Value",
      expected: code.value,
      received: value,
    });
  }

  if (code.identity.id !== identityId) {
    return logger.info({
      type: "code:claimed",
      session: false,
      message: "Invalid Identity ID",
      expected: code.identity.id,
      received: identityId,
    });
  }

  const account = await eventStore.aggregate.getByStream(Identity, identityId);
  if (account === undefined) {
    return logger.info({
      type: "code:claimed",
      session: false,
      message: "Account Not Found",
      expected: code.identity.id,
      received: undefined,
    });
  }

  logger.info({ type: "code:claimed", session: true });

  const options = config.cookie(1000 * 60 * 60 * 24 * 7);

  if (next !== undefined) {
    return new Response(null, {
      status: 302,
      headers: {
        location: next,
        "set-cookie": cookie.serialize("token", await auth.generate({ id: account.id }, "1 week"), options),
      },
    });
  }

  return new Response(null, {
    status: 200,
    headers: {
      "set-cookie": cookie.serialize("token", await auth.generate({ id: account.id }, "1 week"), options),
    },
  });
});
