import identity from "@modules/identity/server.ts";
import workspace from "@modules/workspace/server.ts";
import database from "@platform/database/server.ts";
import { logger } from "@platform/logger";
import { context } from "@platform/relay";
import { Api } from "@platform/server/api.ts";
import server from "@platform/server/server.ts";
import socket from "@platform/socket/server.ts";
import { storage } from "@platform/storage";
import supertokens from "@platform/supertoken/server.ts";

import { config } from "./config.ts";

const log = logger.prefix("Server");

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

// ### Platform

await database.bootstrap();
await server.bootstrap();
await socket.bootstrap();
await supertokens.bootsrap();

// ### Modules

await workspace.bootstrap();

/*
 |--------------------------------------------------------------------------------
 | Service
 |--------------------------------------------------------------------------------
 */

const api = new Api([...identity.routes, ...workspace.routes]);

/*
 |--------------------------------------------------------------------------------
 | Server
 |--------------------------------------------------------------------------------
 */

Deno.serve(
  {
    port: config.port,
    hostname: config.host,
    onListen({ port, hostname }) {
      logger.prefix("Server").info(`Listening at http://${hostname}:${port}`);
    },
  },
  async (request) =>
    storage.run({}, async () => {
      const url = new URL(request.url);

      // ### Storage Context
      // Resolve storage context for all dependent modules.

      await server.resolve(request);
      await socket.resolve();
      await supertokens.resolve(request);

      // ### Fetch
      // Execute fetch against the api instance.

      return api.fetch(request).finally(() => {
        log.info(
          `${request.method} ${url.pathname} [${((Date.now() - context.info.start) / 1000).toLocaleString()} seconds]`,
        );
      });
    }),
);
