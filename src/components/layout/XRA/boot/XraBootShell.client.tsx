"use client";

import * as React from "react";
import type { AppInitState } from "@/stores/store";
import { AppStoreProvider } from "@/stores/provider";
import { ThemeSync } from "@/hooks/theme";
import { ThemePostInit } from "@/hooks/theme-post-init";
import { getXraBootTasks } from "./registry.client";
import type { XraBootContext } from "./types";
import "./default-tasks.client";

export type XraBootShellProps = {
  children: React.ReactNode;
};

const BOOT_TASK_TIMEOUT_MS = 1400;
const BOOT_TOTAL_TIMEOUT_MS = 2600;

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

export function XraBootShell({ children }: XraBootShellProps) {
  const [initState, setInitState] = React.useState<AppInitState | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), BOOT_TOTAL_TIMEOUT_MS);

    const nextInitState: AppInitState = {};
    const ctx: XraBootContext = {
      startedAt,
      pathname: window.location.pathname,
      signal: controller.signal,
      addInitState: (patch) => {
        Object.assign(nextInitState, patch);
      },
    };

    const runTask = async (task: { id: string; run: (ctx: XraBootContext) => unknown }) => {
      try {
        await Promise.race([
          Promise.resolve(task.run(ctx)),
          sleep(BOOT_TASK_TIMEOUT_MS),
          new Promise<void>((resolve) => {
            if (controller.signal.aborted) return resolve();
            controller.signal.addEventListener("abort", () => resolve(), { once: true });
          }),
        ]);
      } catch {
      }
    };

    const run = async () => {
      const tasks = getXraBootTasks();
      await Promise.race([Promise.all(tasks.map((task) => runTask(task))), sleep(BOOT_TOTAL_TIMEOUT_MS)]);

      if (cancelled) return;
      controller.abort();
      setInitState(nextInitState);
    };

    void run();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <>
      <AppStoreProvider initState={initState}>
        <ThemeSync />
        <ThemePostInit />
        {children}
      </AppStoreProvider>
    </>
  );
}
