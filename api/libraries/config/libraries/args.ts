import { parseArgs } from "@std/cli";

import { Parser, toString } from "./parsers.ts";

export function getArgsVariable(key: string, fallback?: any): string;
export function getArgsVariable<T extends Parser>(key: string, parse: T, fallback?: any): ReturnType<T>;
export function getArgsVariable<T extends Parser>(key: string, parse?: T, fallback?: any): ReturnType<T> {
  if (typeof parse === "string") {
    fallback = parse;
    parse = undefined;
  }
  const flags = parseArgs(Deno.args);
  const value = flags[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return parse ? parse(fallback) : fallback;
    }
    throw new Error(`Config Exception: Missing ${key} variable in arguments`);
  }
  return parse ? parse(value) : (toString(value) as any);
}
