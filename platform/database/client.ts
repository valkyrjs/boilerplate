import { AsyncLocalStorage } from "node:async_hooks";

import { takeAll, takeOne } from "@platform/parse";
import postgres, { type Options, type Sql, type TransactionSql } from "postgres";
import transit from "transit-js";
import type { ZodType } from "zod";

const storage = new AsyncLocalStorage<TransactionSql>();

const transitReader = transit.reader("json");
const transitWriter = transit.writer("json", {
  handlers: transit.map([
    Array,
    transit.makeWriteHandler({
      tag: () => "array",
      rep: (arr) => arr,
      stringRep: () => null,
    }),
  ]),
});

/*
 |--------------------------------------------------------------------------------
 | Database
 |--------------------------------------------------------------------------------
 */

export class Client {
  /**
   * Cached SQL instance.
   */
  #db?: Sql;

  /**
   * Instantiate a new Database accessor wrapper.
   *
   * @param db - Dependency container token to retrieve.
   */
  constructor(
    readonly config: Options<{
      transit: {
        to: 16384;
        from: [16384];
        serialize: (value: unknown) => string;
        parse: (value: unknown) => any;
      };
    }>,
  ) {}

  /**
   * SQL instance to perform queries against.
   */
  get sql(): Sql {
    const tx = storage.getStore();
    if (tx !== undefined) {
      return tx;
    }
    return this.#getResolvedInstance();
  }

  /**
   * SQL instance which ignores any potential transaction established
   * in instance scope.
   */
  get direct(): Sql {
    return this.#getResolvedInstance();
  }

  /**
   * Retrieves cached SQL instance or attempts to create and return
   * a new instance.
   */
  #getResolvedInstance(): Sql {
    if (this.#db === undefined) {
      this.#db = postgres({
        ...this.config,
        transform: postgres.camel,
        fetch_types: false,
        connection: {
          fallback_output_format: "transit",
        },
        types: {
          transit: {
            to: 16384,
            from: [16384],
            serialize: (value: unknown) => {
              return transitWriter.write(value);
            },
            parse: (value: string) => {
              return transitReader.read(value);
            },
          },
          bool: {
            to: 16,
          } as unknown as postgres.PostgresType,
          textArray: {
            from: [1009],
            parse: (value: unknown) => {
              return parsePgArray(value);
            },
          } as unknown as postgres.PostgresType,
          int64: {
            from: [20],
            parse: (value: string) => {
              const res = parseInt(value, 10);
              if (Number.isSafeInteger(res) === false) {
                throw Error(`Could not convert to integer reliably: ${value}`);
              }
              return res;
            },
          } as unknown as postgres.PostgresType,
          int: {
            to: 20,
            from: [23, 20],
            parse: parseInt,
          } as unknown as postgres.PostgresType,
        },
      });
    }
    return this.#db;
  }

  /**
   * Initiates a SQL transaction by wrapping a new db instance with a
   * new transaction instance.
   *
   * @example
   * ```ts
   * import { db } from "@optio/database/client.ts";
   *
   * db.begin(async (tx) => {
   *   tx`SELECT ...`
   * });
   * ```
   */
  begin<TResponse>(cb: (tx: TransactionSql) => TResponse | Promise<TResponse>): Promise<UnwrapPromiseArray<TResponse>> {
    return this.direct.begin((tx) => storage.run(tx, () => cb(tx)));
  }

  /**
   * Closes SQL connection if it has been instantiated.
   */
  async close(): Promise<void> {
    if (this.#db !== undefined) {
      await this.#db.end();
      this.#db = undefined;
    }
  }

  /**
   * Returns a schema pepared querying object allowing for a one or many
   * response based on the query used.
   *
   * @param schema - Zod schema to parse.
   */
  schema<TSchema extends ZodType>(schema: TSchema) {
    return {
      /**
       * Executes a sql query and parses the result with the given schema.
       *
       * @param sql - Template string SQL value.
       */
      one: (strings: TemplateStringsArray, ...values: any[]) => this.sql(strings, ...values).then(takeOne(schema)),

      /**
       * Executes a sql query and parses the resulting list with the given schema.
       *
       * @param sql - Template string SQL value.
       */
      many: (strings: TemplateStringsArray, ...values: any[]) => this.sql(strings, ...values).then(takeAll(schema)),
    };
  }

  boolean(value: boolean) {
    return this.sql.typed(value, 16);
  }

  int64(value: number) {
    return this.sql.typed(value, 20);
  }

  int32(value: number) {
    return this.sql.typed(value, 23);
  }

  text(value: string) {
    return this.sql.typed(value, 25);
  }

  float64(value: number) {
    return this.sql.typed(value, 701);
  }

  array(value: string[]) {
    return this.sql.unsafe(`ARRAY[${value.map((v) => `'${v.replace(/'/g, "''")}'`).join(",")}]`);
  }

  transit(value: object) {
    return this.sql.typed(value, 16384);
  }
}

function parsePgArray(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }
  if (value.startsWith("{") && value.endsWith("}")) {
    const content = value.slice(1, -1);
    // Split by comma and strip quotes from each element
    return content ? content.split(",").map((v) => v.trim().replace(/^"|"$/g, "")) : [];
  }
  return value;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type UnwrapPromiseArray<T> = T extends any[]
  ? {
      [k in keyof T]: T[k] extends Promise<infer R> ? R : T[k];
    }
  : T;
