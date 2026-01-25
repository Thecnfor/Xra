"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";
import { setPreference } from "@/lib/storage/indexeddb/client";
import { shallow, useAppStore } from "@/stores";
import type { ResolvedTheme, ThemeMode } from "@/stores/slices/theme";

export const THEME_EVENT_NAME = "xra:theme";
export const THEME_CURRENT_PREFERENCE_KEY = "theme.current";
export const THEME_CURRENT_SNAPSHOT_KEY = "xra:theme.current";
export const THEME_BROWSER_SNAPSHOT_KEY = "xra:theme.browser";

export function normalizeThemeMode(value: unknown): ThemeMode | null {
  if (value === "light" || value === "dark") return value;
  return null;
}

export function readSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readResolvedThemeFromDom(): ResolvedTheme {
  const root = document.documentElement;
  return root.classList.contains("dark") ? "dark" : "light";
}

export function applyThemeMode(mode: ThemeMode, { persist }: { persist: boolean }) {
  const root = document.documentElement;
  const resolved = mode;

  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.dataset.themeMode = mode;
  root.dataset.themeResolved = resolved;
  root.style.colorScheme = resolved;

  if (persist) {
    void setPreference(THEME_CURRENT_PREFERENCE_KEY, mode).catch(() => { });
    try {
      localStorage.setItem(THEME_CURRENT_SNAPSHOT_KEY, mode);
      localStorage.setItem(THEME_BROWSER_SNAPSHOT_KEY, readSystemTheme());
    } catch { }
  }

  window.dispatchEvent(
    new CustomEvent(THEME_EVENT_NAME, { detail: { mode, resolved } }),
  );
}

export function ThemeSync() {
  const setTheme = useAppStore((s) => s.setTheme);
  const setResolvedTheme = useAppStore((s) => s.setResolvedTheme);

  useEffect(() => {
    const root = document.documentElement;

    const syncFromDom = () => {
      const mode = normalizeThemeMode(root.dataset.themeMode) ?? readResolvedThemeFromDom();
      const resolved = readResolvedThemeFromDom();
      setTheme(mode);
      setResolvedTheme(resolved);
    };

    syncFromDom();

    const onThemeEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: unknown; resolved?: unknown }>).detail;
      const mode = normalizeThemeMode(detail?.mode) ?? readResolvedThemeFromDom();
      const resolved = detail?.resolved === "dark" ? "dark" : "light";
      setTheme(mode);
      setResolvedTheme(resolved);
    };

    window.addEventListener(THEME_EVENT_NAME, onThemeEvent);
    return () => window.removeEventListener(THEME_EVENT_NAME, onThemeEvent);
  }, [setResolvedTheme, setTheme]);

  return null;
}

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { themeMode, resolvedTheme } = useAppStore(
    (s) => ({ themeMode: s.theme, resolvedTheme: s.resolvedTheme }),
    shallow,
  );

  const isDark = resolvedTheme === "dark";
  const nextMode = useMemo<ThemeMode>(() => {
    return themeMode === "dark" ? "light" : "dark";
  }, [themeMode]);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const canViewTransition =
      !prefersReducedMotion &&
      "startViewTransition" in document &&
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition ===
      "function";

    const apply = () => applyThemeMode(nextMode, { persist: true });

    if (!canViewTransition) {
      apply();
      return;
    }

    await (document as Document & { startViewTransition: (cb: () => void) => ViewTransition })
      .startViewTransition(() => {
        flushSync(apply);
      }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  }, [duration, nextMode]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">
        切换主题（当前：{isDark ? "深色" : "浅色"}）
      </span>
    </button>
  );
};
