import { AsyncLocalStorage } from "node:async_hooks";

import postgres, { type Options, type Sql, type TransactionSql } from "postgres";
import type { ZodType } from "zod";

import { takeAll, takeOne } from "./parser.ts";

const storage = new AsyncLocalStorage<TransactionSql>();

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
  constructor(readonly config: Options<{}>) {}

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
      this.#db = postgres(this.config);
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
