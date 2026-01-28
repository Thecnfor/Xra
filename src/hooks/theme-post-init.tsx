"use client";

import { useEffect } from "react";

import { getPreference, setPreference } from "@/lib/storage/indexeddb/client";

import { normalizeThemeMode, readSystemTheme } from "./theme";

const THEME_BROWSER_PREFERENCE_KEY = "theme.browser";
const THEME_CURRENT_PREFERENCE_KEY = "theme.current";
const THEME_BROWSER_SNAPSHOT_KEY = "xra:theme.browser";
const THEME_CURRENT_SNAPSHOT_KEY = "xra:theme.current";
const THEME_LEGACY_STORAGE_KEY = "theme";
const THEME_EVENT_NAME = "xra:theme";

type IdleCallbackOptions = { timeout?: number };
type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: IdleCallbackOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function applyThemeDom(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.themeMode = theme;
  root.dataset.themeResolved = theme;
  root.style.colorScheme = theme;
  window.dispatchEvent(new CustomEvent(THEME_EVENT_NAME, { detail: { mode: theme, resolved: theme } }));
}

function readSnapshot(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSnapshot(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch { }
}

function removeSnapshot(key: string) {
  try {
    localStorage.removeItem(key);
  } catch { }
}

async function ensureIndexedDbSync() {
  const systemTheme = readSystemTheme();

  const legacy = normalizeThemeMode(readSnapshot(THEME_LEGACY_STORAGE_KEY));
  if (legacy) {
    writeSnapshot(THEME_CURRENT_SNAPSHOT_KEY, legacy);
    writeSnapshot(THEME_BROWSER_SNAPSHOT_KEY, systemTheme);
    removeSnapshot(THEME_LEGACY_STORAGE_KEY);
  }

  const snapshotCurrent = normalizeThemeMode(readSnapshot(THEME_CURRENT_SNAPSHOT_KEY));
  const snapshotBrowser = normalizeThemeMode(readSnapshot(THEME_BROWSER_SNAPSHOT_KEY));

  const current = snapshotCurrent ?? normalizeThemeMode(await getPreference(THEME_CURRENT_PREFERENCE_KEY)) ?? systemTheme;
  const browser = snapshotBrowser ?? systemTheme;

  writeSnapshot(THEME_CURRENT_SNAPSHOT_KEY, current);
  writeSnapshot(THEME_BROWSER_SNAPSHOT_KEY, browser);

  await Promise.all([
    setPreference(THEME_CURRENT_PREFERENCE_KEY, current),
    setPreference(THEME_BROWSER_PREFERENCE_KEY, browser),
  ]);
}

export function ThemePostInit() {
  useEffect(() => {
    const w = window as unknown as IdleWindow;
    const idleHandle =
      w.requestIdleCallback?.(() => {
        void ensureIndexedDbSync().catch(() => { });
      }, { timeout: 2500 }) ?? window.setTimeout(() => void ensureIndexedDbSync().catch(() => { }), 1200);

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    let observed = readSystemTheme();

    const onChange = () => {
      const next = readSystemTheme();
      if (next === observed) return;
      observed = next;

      applyThemeDom(next);
      writeSnapshot(THEME_BROWSER_SNAPSHOT_KEY, next);
      writeSnapshot(THEME_CURRENT_SNAPSHOT_KEY, next);

      void Promise.all([
        setPreference(THEME_BROWSER_PREFERENCE_KEY, next),
        setPreference(THEME_CURRENT_PREFERENCE_KEY, next),
      ]).catch(() => { });
    };

    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      w.cancelIdleCallback?.(idleHandle);
      window.clearTimeout(idleHandle);
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  return null;
}
