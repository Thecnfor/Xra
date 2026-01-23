"use client"

import { useCallback, useMemo, useRef } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/provider"
import { applyThemeMode, readResolvedThemeFromDom } from "./theme-sync"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const themeMode = useAppStore((s) => s.theme)
  const resolvedTheme = useAppStore((s) => s.resolvedTheme)
  const setTheme = useAppStore((s) => s.setTheme)
  const setResolvedTheme = useAppStore((s) => s.setResolvedTheme)

  const isDark = resolvedTheme === "dark"
  const nextMode = useMemo(() => {
    if (themeMode === "system") return "light"
    if (themeMode === "light") return "dark"
    return "system"
  }, [themeMode])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches

    const canViewTransition =
      !prefersReducedMotion &&
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition ===
        "function"

    const apply = () => {
      applyThemeMode(nextMode, { persist: true })
      setTheme(nextMode)
      setResolvedTheme(readResolvedThemeFromDom())
    }

    if (!canViewTransition) {
      apply()
      return
    }

    await (document as Document & { startViewTransition: (cb: () => void) => ViewTransition })
      .startViewTransition(() => {
        flushSync(apply)
      }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

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
      }
    )
  }, [duration, nextMode, setResolvedTheme, setTheme])

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
  )
}
