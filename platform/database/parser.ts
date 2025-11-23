import type z from "zod";
import type { ZodType } from "zod";

/**
 * Takes a single record from a list of database rows.
 *
 * @param rows - List of rows to retrieve record from.
 */
export function takeOne<TSchema extends ZodType>(
  schema: TSchema,
): (records: unknown[]) => z.output<TSchema> | undefined {
  return (records: unknown[]) => {
    if (records[0] === undefined) {
      return undefined;
    }
    return schema.parse(records[0]);
  };
}

/**
 * Takes all records from a list of database rows and validates each one.
 *
 * @param schema - Zod schema to validate each record against.
 */
export function takeAll<TSchema extends ZodType>(schema: TSchema): (records: unknown[]) => z.output<TSchema>[] {
  return (records: unknown[]) => {
    return records.map((record) => schema.parse(record));
  };
}
