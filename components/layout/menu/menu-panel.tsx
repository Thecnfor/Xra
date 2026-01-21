"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { menuItems } from "./menu-items";

type MenuPanelProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  initialFocusRef: React.RefObject<HTMLDivElement | null>;
};

function MenuPanel({ className, open, onClose, initialFocusRef }: MenuPanelProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-300 ease-out",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-100",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transform-gpu bg-gradient-to-l from-foreground/12 via-foreground/6 to-transparent backdrop-blur-xl transition-[opacity,transform,translate] duration-sidebar ease-curve-sidebar motion-reduce:transition-none dark:from-black/50 dark:via-black/24 dark:to-transparent",
          open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6",
        )}
        onMouseDown={(e) => {
          if (!open) return;
          if (e.target === e.currentTarget) onClose();
        }}
      />

      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[min(440px,100vw)] transform-gpu will-change-transform transition-[transform,translate,opacity] duration-sidebar ease-curve-sidebar motion-reduce:transition-none",
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-100",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="菜单"
      >
        <div className="relative h-full border-l border-border/60 bg-background/70 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:bg-background/60 dark:shadow-black/40">
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />

          <div className="flex h-full flex-col px-6 pt-6 pb-8">
            <div className="flex items-start">
              <div
                ref={initialFocusRef}
                tabIndex={-1}
                className="select-none outline-none"
              >
                <div className="text-xs font-medium tracking-[0.22em] text-muted-foreground">
                  MENU
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight">
                  XRAK
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="text-[11px] font-medium tracking-[0.24em] text-muted-foreground">
                NAVIGATION
              </div>

              <nav className="mt-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block rounded-2xl border border-transparent px-4 py-3 transition-colors hover:border-border/60 hover:bg-foreground/5 focus-ring"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[15px] font-medium tracking-tight">
                        {item.label}
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground/20 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 motion-reduce:transition-none" />
                    </div>
                    {item.description ? (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    ) : null}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-auto pt-8">
              <div className="rounded-2xl surface-glass px-4 py-3 text-xs text-muted-foreground">
                按 Esc 关闭，或点击空白处返回
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MenuPanel);
