"use client";

import Dexie, { type Table } from "dexie";
import type { KvRow } from "./types";
import { applyMigrations } from "./migrations.client";

export class XraIndexedDb extends Dexie {
  kv!: Table<KvRow, string>;
}

function createXraIndexedDb() {
  const db = new XraIndexedDb("xra");
  applyMigrations(db);
  return db;
}

const globalForIndexedDb = globalThis as unknown as {
  xraIndexedDb?: XraIndexedDb;
};

const xraIndexedDb = globalForIndexedDb.xraIndexedDb ?? createXraIndexedDb();

if (process.env.NODE_ENV !== "production") {
  globalForIndexedDb.xraIndexedDb = xraIndexedDb;
}

export function getXraIndexedDb() {
  if (typeof window === "undefined") {
    throw new Error("XraIndexedDb can only be used in the browser.");
  }
  return xraIndexedDb;
}

