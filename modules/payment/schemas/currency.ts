import z from "zod";

/*
 |--------------------------------------------------------------------------------
 | Currency
 |--------------------------------------------------------------------------------
 |
 | A union of currencies the system supports trade in.
 |
 */

export const CurrencySchema = z.union([
  z.literal("USD").describe("United States Dollar"),
  z.literal("EUR").describe("Euro"),
  z.literal("GBP").describe("British Pound Sterling"),
  z.literal("CHF").describe("Swiss Franc"),
  z.literal("JPY").describe("Japanese Yen"),
  z.literal("CAD").describe("Canadian Dollar"),
  z.literal("AUD").describe("Australian Dollar"),
  z.literal("NOK").describe("Norwegian Krone"),
  z.literal("SEK").describe("Swedish Krona"),
]);

export type Currency = z.output<typeof CurrencySchema>;
