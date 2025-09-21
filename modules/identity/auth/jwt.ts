import { config } from "../config.ts";

export const jwt = {
  algorithm: "RS256",
  privateKey: config.auth.privateKey,
  publicKey: config.auth.publicKey,
  issuer: "http://localhost",
  audience: "http://localhost",
};
