"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { menuItems, type MenuItem } from "./menu-items";
import { SlidePanel, type SlidePanelSide } from "@/components/ui/overlays";
import { useMediaQuery } from "@/hooks/use-media-query";

export type MenuPanelProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  label?: string;
  items?: MenuItem[];
  onNavigate?: (item: MenuItem) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLDivElement | null>;
  overlayClassName?: string;
  panelClassName?: string;
  exitMs?: number;
  unmountOnClose?: boolean;
  mobileSide?: Extract<SlidePanelSide, "top" | "bottom">;
  desktopSide?: Extract<SlidePanelSide, "left" | "right">;
};

function MenuPanel({
  className,
  open,
  onClose,
  label = "菜单",
  items = menuItems,
  onNavigate,
  header,
  footer,
  initialFocusRef,
  overlayClassName,
  panelClassName,
  exitMs,
  unmountOnClose,
  mobileSide = "top",
  desktopSide = "right",
}: MenuPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const side: SlidePanelSide = isDesktop ? desktopSide : mobileSide;
  const enableStagger = side === "top";
  const fallbackFocusRef = React.useRef<HTMLDivElement | null>(null);
  const resolvedFocusRef = initialFocusRef ?? fallbackFocusRef;
  const handleNavigate = React.useCallback(
    (item: MenuItem) => {
      onNavigate?.(item);
      onClose();
    },
    [onNavigate, onClose],
  );

  return (
    <SlidePanel
      key={side}
      className={className}
      open={open}
      onClose={onClose}
      side={side}
      label={label}
      panelClassName={panelClassName}
      exitMs={exitMs}
      unmountOnClose={unmountOnClose}
      overlayClassName={cn(
        "bg-gradient-to-b from-foreground/14 via-foreground/7 to-transparent backdrop-blur-xl backdrop-saturate-150 dark:from-black/55 dark:via-black/26 dark:to-transparent",
        side === "right"
          ? "bg-gradient-to-l from-foreground/12 via-foreground/6 to-transparent dark:from-black/50 dark:via-black/24"
          : side === "left"
            ? "bg-gradient-to-r from-foreground/12 via-foreground/6 to-transparent dark:from-black/50 dark:via-black/24"
            : null,
        overlayClassName,
      )}
    >
      <div
        className={cn(
          "relative h-full bg-background/66 backdrop-blur-2xl backdrop-saturate-150 dark:bg-background/55",
          "before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:shadow-2xl before:shadow-black/10 before:transition-opacity before:duration-sidebar before:ease-curve-sidebar motion-reduce:before:transition-none dark:before:shadow-black/40",
          open ? "before:opacity-100" : "before:opacity-0",
          side === "top"
            ? "rounded-b-4xl border-b border-border/60 before:rounded-b-4xl"
            : null,
          side === "bottom"
            ? "rounded-t-4xl border-t border-border/60 before:rounded-t-4xl"
            : null,
          side === "right" ? "border-l border-border/60" : null,
          side === "left" ? "border-r border-border/60" : null,
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent",
            side === "right" ? null : "hidden",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent",
            side === "left" ? null : "hidden",
          )}
        />
        <div
          className={cn(
            "absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/14 to-transparent",
            side === "top" ? null : "hidden",
          )}
        />
        <div
          className={cn(
            "absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-foreground/14 to-transparent",
            side === "bottom" ? null : "hidden",
          )}
        />

        <div
          className={cn(
            "flex h-full flex-col overflow-y-auto overscroll-contain",
            side === "top"
              ? "px-5 pt-[calc(env(safe-area-inset-top)+5.5rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]"
              : "px-6 pt-6 pb-8",
          )}
        >
          <div className="flex items-start">
            <div
              ref={resolvedFocusRef}
              tabIndex={-1}
              className="select-none outline-none"
            >
              {header ?? (
                <>
                  <div className="text-xs font-medium tracking-[0.22em] text-muted-foreground">
                    MENU
                  </div>
                  <div className="mt-2 text-xl font-semibold tracking-tight">
                    XRAK
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-10">
            <div className="text-[11px] font-medium tracking-[0.24em] text-muted-foreground">
              NAVIGATION
            </div>

            <nav className="mt-4 space-y-2">
              {items.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block rounded-2xl border border-transparent px-4 py-3 transition-colors hover:border-border/60 hover:bg-foreground/5 focus-ring"
                  onClick={() => handleNavigate(item)}
                >
                  <div
                    className={cn(
                      "transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                      enableStagger ? "[transition-delay:var(--menu-delay)]" : null,
                      open
                        ? "opacity-100 translate-y-0"
                        : enableStagger
                          ? "opacity-0 -translate-y-2"
                          : "opacity-100 translate-y-0",
                    )}
                    style={
                      enableStagger
                        ? ({
                          "--menu-delay": open
                            ? `${120 + index * 60}ms`
                            : "0ms",
                        } as React.CSSProperties)
                        : undefined
                    }
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
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-8">
            {footer ?? (
              <div className="rounded-2xl surface-glass px-4 py-3 text-xs text-muted-foreground">
                按 Esc 关闭，或点击空白处返回
              </div>
            )}
          </div>
        </div>
      </div>
    </SlidePanel>
  );
}

export default React.memo(MenuPanel);
