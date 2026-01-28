"use client";

import { registerXraBootTask } from "./registry.client";
import { getXraIndexedDb } from "@/lib/storage/indexeddb/client";

type IdleCallbackOptions = { timeout?: number };
type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: IdleCallbackOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

registerXraBootTask({
  id: "theme:hydrate",
  run: ({ addInitState }) => {
    const resolved = document.documentElement.classList.contains("dark") ? "dark" : "light";
    addInitState({ theme: resolved, resolvedTheme: resolved });
  },
});

registerXraBootTask({
  id: "indexeddb:warmup",
  run: ({ signal }) => {
    if (signal.aborted) return;
    const w = window as unknown as IdleWindow;
    const db = getXraIndexedDb();
    const open = () => {
      if (signal.aborted) return;
      void db.open().catch(() => { });
    };

    const handle = w.requestIdleCallback?.(open, { timeout: 3000 }) ?? window.setTimeout(open, 1500);

    const cancel = () => {
      w.cancelIdleCallback?.(handle);
      window.clearTimeout(handle);
    };

    if (signal.aborted) cancel();
    else signal.addEventListener("abort", cancel, { once: true });
  },
});
