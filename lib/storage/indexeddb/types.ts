export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[];

export type KvNamespace = string;

export type KvKey = string;

export type KvId = string;

export type KvUpdatedAt = number;

export interface KvRow<TValue = JsonValue> {
  id: KvId;
  namespace: KvNamespace;
  key: KvKey;
  value: TValue;
  updatedAt: KvUpdatedAt;
}

export type PreferenceNamespace = "preferences";

