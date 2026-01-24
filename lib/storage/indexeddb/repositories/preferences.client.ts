"use client";

import type { JsonValue } from "../types";
import { kvDelete, kvGet, kvSet } from "./kv.client";

const PREFERENCES_NAMESPACE = "preferences";

export async function getPreference<TValue extends JsonValue>(key: string) {
  return kvGet<TValue>(PREFERENCES_NAMESPACE, key);
}

export async function setPreference<TValue extends JsonValue>(
  key: string,
  value: TValue,
) {
  await kvSet(PREFERENCES_NAMESPACE, key, value);
}

export async function deletePreference(key: string) {
  await kvDelete(PREFERENCES_NAMESPACE, key);
}

