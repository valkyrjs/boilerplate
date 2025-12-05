import z, { type ZodType } from "zod";

import { assertZonedDateTime } from "./time.ts";

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

/**
 * Maps a XTDB NEST_MANY sub query to the provided schema.
 *
 * @param schema - Schema to parse the NEST_MANY result against.
 */
export function nestMany<TSchema extends ZodType>(schema: TSchema) {
  return z.array(z.preprocess(xtdbEntriesToObject, schema)).default([]);
}

/**
 * Check for a _entries key on the provided record and re-map them to
 * a new object if _entries exists.
 *
 * @param record - Record to re-map.
 */
function xtdbEntriesToObject(record: any) {
  if ("_entries" in record) {
    const obj: any = {};
    for (let i = 0; i < record._entries.length; i += 2) {
      obj[record._entries[i]] = xtdbEntryValue(record._entries[i + 1]);
    }
    return obj;
  }
  return record;
}

function xtdbEntryValue(value: unknown) {
  if (Array.isArray(value) === true) {
    return value;
  }
  if (typeof value === "object" && assertZonedDateTime(value) === true) {
    return value.rep.replace("[UTC]", "");
  }
  return value;
}
