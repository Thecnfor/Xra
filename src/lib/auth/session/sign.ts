import { createHmac } from "node:crypto";
import {
  getSecret,
  getSessionMaxAge,
  SessionPayload
} from "./index";

export function signSession(userId: string) {
  const secret = getSecret();
  const expiresAt = Date.now() + getSessionMaxAge() * 1000;

  const payloadData: SessionPayload = { u: userId, e: expiresAt };
  const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64url");

  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}
