"use client";

import { liveQuery } from "dexie";
import { useCallback, useEffect, useState } from "react";

import type { JsonValue, KvNamespace } from "@/lib/storage/indexeddb";
import { kvGet, kvSet } from "@/lib/storage/indexeddb/client";

export function useKvValue<TValue extends JsonValue>(
  namespace: KvNamespace,
  key: string,
  options?: { fallback?: TValue },
) {
  const fallback = options?.fallback;
  const [{ value, isLoading, error }, setSnapshot] = useState<{
    value: TValue | undefined;
    isLoading: boolean;
    error: unknown;
  }>(() => ({ value: fallback, isLoading: true, error: null }));

  useEffect(() => {
    const observable = liveQuery(async () => {
      const next = await kvGet<TValue>(namespace, key);
      return next ?? fallback;
    });

    const subscription = observable.subscribe({
      next: (next) => {
        setSnapshot({ value: next, isLoading: false, error: null });
      },
      error: (err) => {
        setSnapshot({ value: fallback, isLoading: false, error: err });
      },
    });

    return () => subscription.unsubscribe();
  }, [fallback, key, namespace]);

  const set = useCallback(
    async (next: TValue) => {
      await kvSet(namespace, key, next);
    },
    [key, namespace],
  );

  return { value, set, isLoading, error };
}
