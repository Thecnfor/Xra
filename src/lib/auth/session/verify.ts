import { createHmac, timingSafeEqual } from "node:crypto";
import {
    getSecret,
    SessionSchema
} from "./index";

export function verifySession(token: string) {
    try {
        const i = token.lastIndexOf(".");
        if (i <= 0) return null;

        const payloadStr = token.slice(0, i);
        const sig = token.slice(i + 1);
        const secret = getSecret();

        const expected = createHmac("sha256", secret).update(payloadStr).digest("hex");

        // 使用 timingSafeEqual 防止定时攻击
        const expectedBuffer = Buffer.from(expected);
        const sigBuffer = Buffer.from(sig);

        if (expectedBuffer.length !== sigBuffer.length || !timingSafeEqual(expectedBuffer, sigBuffer)) {
            return null;
        }

        const rawPayload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());
        const result = SessionSchema.safeParse(rawPayload);

        if (!result.success) return null;

        const { u: userId, e: expiresAt } = result.data;

        if (Date.now() > expiresAt) {
            return null;
        }

        return userId;
    } catch {
        return null;
    }
}
