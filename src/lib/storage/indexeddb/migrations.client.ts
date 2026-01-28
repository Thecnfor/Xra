"use client";

import type Dexie from "dexie";

export function applyMigrations(db: Dexie) {
  db.version(1).stores({
    kv: "id, namespace, key, updatedAt",
  });
}

