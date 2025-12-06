import z from "zod";

/*
 |--------------------------------------------------------------------------------
 | Currency
 |--------------------------------------------------------------------------------
 |
 | A union of currencies the system supports trade in.
 |
 */

export const currencies = ["USD", "EUR", "GBP", "CHF", "JPY", "CAD", "AUD", "NOK", "SEK"] as const;

export const CurrencySchema = z.union([
  z.literal(currencies[0]).describe("United States Dollar"),
  z.literal(currencies[1]).describe("Euro"),
  z.literal(currencies[2]).describe("British Pound Sterling"),
  z.literal(currencies[3]).describe("Swiss Franc"),
  z.literal(currencies[4]).describe("Japanese Yen"),
  z.literal(currencies[5]).describe("Canadian Dollar"),
  z.literal(currencies[6]).describe("Australian Dollar"),
  z.literal(currencies[7]).describe("Norwegian Krone"),
  z.literal(currencies[8]).describe("Swedish Krona"),
]);

export type Currency = z.output<typeof CurrencySchema>;
