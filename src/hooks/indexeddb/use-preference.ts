"use client";

import type { JsonValue } from "@/lib/storage/indexeddb";
import { useKvValue } from "./use-kv";

export function usePreference<TValue extends JsonValue>(
  key: string,
  options?: { fallback?: TValue },
) {
  return useKvValue<TValue>("preferences", key, options);
}

