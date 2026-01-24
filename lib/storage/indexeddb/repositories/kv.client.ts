"use client";

import { getXraIndexedDb } from "../db.client";
import type { JsonValue, KvNamespace, KvRow } from "../types";

function makeKvId(namespace: KvNamespace, key: string) {
  return `${namespace}:${key}`;
}

export async function kvGet<TValue extends JsonValue>(
  namespace: KvNamespace,
  key: string,
) {
  const db = getXraIndexedDb();
  const row = await db.kv.get(makeKvId(namespace, key));
  return row?.value as TValue | undefined;
}

export async function kvSet<TValue extends JsonValue>(
  namespace: KvNamespace,
  key: string,
  value: TValue,
) {
  const db = getXraIndexedDb();
  const row: KvRow<TValue> = {
    id: makeKvId(namespace, key),
    namespace,
    key,
    value,
    updatedAt: Date.now(),
  };
  await db.kv.put(row as KvRow);
}

export async function kvDelete(namespace: KvNamespace, key: string) {
  const db = getXraIndexedDb();
  await db.kv.delete(makeKvId(namespace, key));
}

export async function kvListByNamespace(namespace: KvNamespace) {
  const db = getXraIndexedDb();
  return db.kv.where("namespace").equals(namespace).toArray();
}

