"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/provider";

import type { ResolvedTheme, ThemeMode } from "@/stores/slices/theme";

export const THEME_STORAGE_KEY = "theme";

export function normalizeThemeMode(value: unknown): ThemeMode {
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

export function readStoredThemeMode(): ThemeMode {
  try {
    return normalizeThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

export function readResolvedThemeFromDom(): ResolvedTheme {
  const root = document.documentElement;
  return root.classList.contains("dark") ? "dark" : "light";
}

export function applyThemeMode(mode: ThemeMode, { persist }: { persist: boolean }) {
  const root = document.documentElement;
  const systemResolved =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light";
  const resolved = mode === "system" ? systemResolved : mode;

  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.dataset.themeMode = mode;
  root.dataset.themeResolved = resolved;
  root.style.colorScheme = resolved;

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {}
  }
}

export function ThemeSync() {
  const setTheme = useAppStore((s) => s.setTheme);
  const setResolvedTheme = useAppStore((s) => s.setResolvedTheme);

  useEffect(() => {
    const root = document.documentElement;

    const syncFromDom = () => {
      const mode = normalizeThemeMode(root.dataset.themeMode ?? readStoredThemeMode());
      const resolved = readResolvedThemeFromDom();
      setTheme(mode);
      setResolvedTheme(resolved);
    };

    syncFromDom();

    const observer = new MutationObserver(syncFromDom);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme-mode", "data-theme-resolved"],
    });

    return () => observer.disconnect();
  }, [setTheme, setResolvedTheme]);

  return null;
}

