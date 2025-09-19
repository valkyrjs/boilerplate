import z, { ZodObject } from "zod";

export function makeModelParser<TSchema extends ZodObject>(schema: TSchema): ModelParserFn<TSchema> {
  return ((value: unknown | unknown[]) => {
    if (Array.isArray(value)) {
      return value.map((value: unknown) => schema.parse(value));
    }
    return schema.parse(value);
  }) as ModelParserFn<TSchema>;
}

type ModelParserFn<TSchema extends ZodObject> = {
  (value: unknown): z.infer<TSchema>;
  (value: unknown[]): z.infer<TSchema>[];
};
