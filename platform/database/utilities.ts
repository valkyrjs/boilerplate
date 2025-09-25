import type { Db } from "mongodb";
import type { ZodObject, ZodType, z } from "zod";

/**
 * TODO ...
 */
export function takeOne<TDocument>(documents: TDocument[]): TDocument | undefined {
  return documents[0];
}

/**
 * TODO ...
 */
export function makeDocumentParser<TSchema extends ZodObject>(schema: TSchema): ModelParserFn<TSchema> {
  return ((value: unknown | unknown[]) => {
    if (Array.isArray(value)) {
      return value.map((value: unknown) => schema.parse(value));
    }
    if (value === undefined || value === null) {
      return undefined;
    }
    return schema.parse(value);
  }) as ModelParserFn<TSchema>;
}

/**
 * TODO ...
 */
export function toParsedDocuments<TSchema extends ZodType>(
  schema: TSchema,
): (documents: unknown[]) => Promise<z.infer<TSchema>[]> {
  return async (documents: unknown[]) => {
    const parsed = [];
    for (const document of documents) {
      parsed.push(await schema.parseAsync(document));
    }
    return parsed;
  };
}

/**
 * TODO ...
 */
export function toParsedDocument<TSchema extends ZodType>(
  schema: TSchema,
): (document?: unknown) => Promise<z.infer<TSchema> | undefined> {
  return async (document: unknown) => {
    if (document === undefined || document === null) {
      return undefined;
    }
    return schema.parseAsync(document);
  };
}

/**
 * Get a Set of collections that exists on a given mongo database instance.
 *
 * @param db - Mongo database to fetch collection list for.
 */
export async function getCollectionsSet(db: Db) {
  return db
    .listCollections()
    .toArray()
    .then((collections) => new Set(collections.map((c) => c.name)));
}

type ModelParserFn<TSchema extends ZodObject> = {
  (value: unknown): z.infer<TSchema> | undefined;
  (value: unknown[]): z.infer<TSchema>[];
};
