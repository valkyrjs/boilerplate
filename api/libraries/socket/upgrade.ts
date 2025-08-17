import { toJsonRpc } from "@valkyr/json-rpc";

import { Session } from "~libraries/auth/mod.ts";
import { logger } from "~libraries/logger/mod.ts";
import { asyncLocalStorage } from "~libraries/server/storage.ts";

import { sockets } from "./sockets.ts";

export function upgrade(request: Request, session?: Session) {
  const { socket, response } = Deno.upgradeWebSocket(request);

  socket.addEventListener("open", () => {
    logger.prefix("Socket").info("socket connected", { session });
    sockets.add(socket);
  });

  socket.addEventListener("close", () => {
    logger.prefix("Socket").info("socket disconnected", { session });
    sockets.del(socket);
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      return;
    }

    const message = toJsonRpc(event.data);

    logger.prefix("Socket").info(message);

    asyncLocalStorage.run(
      {
        session,
        info: {
          method: message.method!,
          start: Date.now(),
        },
        sockets,
        response: {
          headers: new Headers(),
        },
      },
      async () => {
        // api
        //   .send(body)
        //   .then((response) => {
        //     if (response !== undefined) {
        //       logger.info({ response });
        //       socket.send(JSON.stringify(response));
        //     }
        //   })
        //   .catch((error) => {
        //     logger.info({ error });
        //     socket.send(JSON.stringify(error));
        //   });
      },
    );
  });

  return response;
}
