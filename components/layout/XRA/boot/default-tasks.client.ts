"use client";

import { registerXraBootTask } from "./registry.client";
import { getXraIndexedDb } from "@/lib/storage/indexeddb/client";

registerXraBootTask({
  id: "theme:hydrate",
  run: ({ addInitState }) => {
    const resolved = document.documentElement.classList.contains("dark") ? "dark" : "light";
    addInitState({ theme: resolved, resolvedTheme: resolved });
  },
});

registerXraBootTask({
  id: "indexeddb:warmup",
  run: async ({ signal }) => {
    if (signal.aborted) return;
    const db = getXraIndexedDb();
    const abortPromise = new Promise<void>((resolve) => {
      if (signal.aborted) return resolve();
      signal.addEventListener("abort", () => resolve(), { once: true });
    });
    await Promise.race([db.open().then(() => {}), abortPromise]).catch(() => {});
  },
});
