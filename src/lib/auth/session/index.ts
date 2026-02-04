import { randomBytes } from "node:crypto";
import { z } from "zod";

export const DEFAULT_COOKIE_NAME = "xra_session";
export const DEFAULT_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

// Session Payload Schema
export const SessionSchema = z.object({
  u: z.string(), // userId
  e: z.number(), // expiresAt
});

export type SessionPayload = z.infer<typeof SessionSchema>;

let SECRET_CACHE: string | undefined;

export function getSessionMaxAge() {
  const maxAge = process.env.XRA_SESSION_MAX_AGE;
  return maxAge ? Number(maxAge) : DEFAULT_MAX_AGE;
}

export function getSessionCookieName() {
  return process.env.XRA_SESSION_COOKIE ?? DEFAULT_COOKIE_NAME;
}

export function getSecret() {
  const s = process.env.XRA_SESSION_SECRET;
  if (s && s.length >= 32) return s;

  if (process.env.NODE_ENV === "production") {
    throw new Error("XRA_SESSION_SECRET must be set in production and at least 32 characters.");
  }

  if (!SECRET_CACHE) {
    SECRET_CACHE = randomBytes(32).toString("hex");
  }
  return SECRET_CACHE;
}

export * from "./sign";
export * from "./verify";
