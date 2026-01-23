"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";
import { shallow, useAppStore } from "@/stores";
import type { ResolvedTheme, ThemeMode } from "@/stores/slices/theme";

export const THEME_STORAGE_KEY = "theme";
export const THEME_EVENT_NAME = "xra:theme";

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
  const systemResolved = window.matchMedia("(prefers-color-scheme: dark)").matches
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
      const mode = normalizeThemeMode(root.dataset.themeMode ?? readStoredThemeMode());
      const resolved = readResolvedThemeFromDom();
      setTheme(mode);
      setResolvedTheme(resolved);
    };

    syncFromDom();

    const onThemeEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: unknown; resolved?: unknown }>).detail;
      const mode = normalizeThemeMode(detail?.mode);
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
    if (themeMode === "system") return "light";
    if (themeMode === "light") return "dark";
    return "system";
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
      {themeMode === "system" ? <Monitor /> : isDark ? <Sun /> : <Moon />}
      <span className="sr-only">
        切换主题（当前：{themeMode === "system" ? "跟随系统" : isDark ? "深色" : "浅色"}）
      </span>
    </button>
  );
};

