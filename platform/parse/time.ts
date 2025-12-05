import z from "zod";

export const ZonedDateTimeSchema = z.object({
  tag: z.literal("time/zoned-date-time"),
  rep: z.string(),
  hashCode: z.number(),
});

export function assertZonedDateTime(value: object | null): value is ZonedDateTime {
  return ZonedDateTimeSchema.parse(value) !== undefined;
}

export type ZonedDateTime = z.output<typeof ZonedDateTimeSchema>;
