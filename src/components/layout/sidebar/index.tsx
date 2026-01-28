"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { selectIsSidebarDrawerOpen, useAppStore } from "@/stores";
import { sidebarMenuItems } from "./sidebar-item";

const IconChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 6L15 12L9 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 6L9 12L15 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function XraSidebarLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const open = useAppStore(selectIsSidebarDrawerOpen);
  const [activeTopKey, setActiveTopKey] = React.useState<string | null>(null);
  const activeTopItem = React.useMemo(
    () => sidebarMenuItems.find((item) => item.key === activeTopKey),
    [activeTopKey],
  );
  const activeChildren = React.useMemo(() => {
    if (!activeTopItem) return [];
    if ("children" in activeTopItem) return activeTopItem.children ?? [];
    return [];
  }, [activeTopItem]);

  React.useEffect(() => {
    if (open) return;
    setActiveTopKey(null);
  }, [open]);

  return (
    <div className={cn("relative min-h-dvh w-full", className)}>
      <div className="flex min-h-dvh w-full">
        <div
          className={cn(
            "shrink-0 transition-[width] duration-sidebar ease-curve-sidebar",
            open ? "w-[200px]" : "w-0",
          )}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <div
        className={cn(
          "fixed left-0 z-50 w-[200px] mt-[127px]",
          "top-[calc(env(safe-area-inset-top)+var(--header-height))]",
          "h-[calc(100dvh-(env(safe-area-inset-top)+var(--header-height)))]",
          "transform-[translateZ(0)] transition-[translate] duration-sidebar ease-curve-sidebar",
          open ? "translate-x-0 pointer-events-auto" : "-translate-x-[200px] pointer-events-none",
        )}
      >
        <aside
          id="sidebar-drawer"
          className={cn(
            "h-full w-full",
            "bg-background/60 backdrop-blur-xl",
          )}
        >
          <div className="flex h-full w-full flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
              <nav className="relative h-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col gap-1 transition-[translate] duration-sidebar ease-curve-sidebar",
                    activeTopKey ? "-translate-x-[200px]" : "translate-x-0",
                  )}
                >
                  {sidebarMenuItems.map((item) =>
                    "children" in item ? (
                      <button
                        key={item.key}
                        type="button"
                        className={cn(
                          "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm",
                          "text-foreground/80 hover:bg-foreground/6 hover:text-foreground",
                          "focus-ring",
                        )}
                        onClick={() => setActiveTopKey(item.key)}
                      >
                        <span className="truncate">{item.label}</span>
                        <span
                          className={cn(
                            "text-foreground/50 opacity-0 translate-x-1 transition-[opacity,translate] duration-sidebar ease-curve-sidebar",
                            "group-hover:opacity-100 group-hover:translate-x-0",
                          )}
                        >
                          <IconChevronRight />
                        </span>
                      </button>
                    ) : (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={cn(
                          "flex w-full items-center rounded-md px-3 py-2 text-sm",
                          "text-foreground/80 hover:bg-foreground/6 hover:text-foreground",
                          "focus-ring",
                        )}
                      >
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ),
                  )}
                </div>

                <div
                  className={cn(
                    "absolute inset-0 flex flex-col transition-[translate] duration-sidebar ease-curve-sidebar",
                    activeTopKey ? "translate-x-0" : "translate-x-[200px]",
                  )}
                >
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                      "text-foreground/80 hover:bg-foreground/6 hover:text-foreground",
                      "focus-ring",
                    )}
                    onClick={() => setActiveTopKey(null)}
                  >
                    <IconChevronLeft />
                    返回首页
                  </button>

                  <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                      {activeChildren.map((entry, idx) =>
                        entry.type === "label" ? (
                          <div
                            key={`label:${idx}:${entry.label}`}
                            className="select-none px-3 py-2 text-xs font-medium tracking-[0.18em] text-muted-foreground/90"
                          >
                            {entry.label}
                          </div>
                        ) : (
                          <Link
                            key={entry.key}
                            href={entry.href}
                            className={cn(
                              "flex w-full items-center rounded-md px-3 py-2 text-sm",
                              "text-foreground/80 hover:bg-foreground/6 hover:text-foreground",
                              "focus-ring",
                            )}
                          >
                            <span className="truncate">{entry.label}</span>
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
