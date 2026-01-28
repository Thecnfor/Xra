"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import Sheet, { type SheetSide } from "../sheet";

export type MenuOverlayItem = {
  href: string;
  label: string;
  description?: string;
};

export type MenuOverlayProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  items: MenuOverlayItem[];
  label?: string;
  onNavigate?: (item: MenuOverlayItem) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  overlayClassName?: string;
  panelClassName?: string;
  exitMs?: number;
  unmountOnClose?: boolean;
  mobileSide?: Extract<SheetSide, "top" | "bottom">;
  desktopSide?: Extract<SheetSide, "left" | "right">;
};

function MenuOverlay({
  className,
  open,
  onClose,
  items,
  label = "菜单",
  onNavigate,
  header,
  footer,
  overlayClassName,
  panelClassName,
  exitMs,
  unmountOnClose,
  mobileSide = "top",
  desktopSide = "right",
}: MenuOverlayProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const side: SheetSide = isDesktop ? desktopSide : mobileSide;
  const enableStagger = true;
  const resolvedPanelClassName = cn(
    panelClassName,
    side === "top" ? "h-auto max-h-[100dvh]" : null,
  );
  const [itemsMotionOpen, setItemsMotionOpen] = React.useState(false);
  const handleNavigate = React.useCallback(
    (item: MenuOverlayItem) => {
      onNavigate?.(item);
      onClose();
    },
    [onNavigate, onClose],
  );

  React.useLayoutEffect(() => {
    if (!open) {
      setItemsMotionOpen(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setItemsMotionOpen(true);
      return;
    }

    setItemsMotionOpen(false);
    const raf = window.requestAnimationFrame(() => setItemsMotionOpen(true));
    return () => window.cancelAnimationFrame(raf);
  }, [open, side]);

  return (
    <Sheet
      key={side}
      className={className}
      open={open}
      onClose={onClose}
      side={side}
      label={label}
      panelClassName={resolvedPanelClassName}
      exitMs={exitMs}
      unmountOnClose={unmountOnClose}
      overlayClassName={cn(
        "bg-linear-to-b from-foreground/14 via-foreground/7 to-transparent backdrop-blur-xl backdrop-saturate-150 dark:from-black/55 dark:via-black/26 dark:to-transparent",
        side === "right"
          ? "bg-linear-to-l from-foreground/12 via-foreground/6 to-transparent dark:from-black/50 dark:via-black/24"
          : side === "left"
            ? "bg-linear-to-r from-foreground/12 via-foreground/6 to-transparent dark:from-black/50 dark:via-black/24"
            : null,
        overlayClassName,
      )}
    >
      <div
        className={cn(
          "relative bg-background/66 backdrop-blur-2xl backdrop-saturate-150 dark:bg-background/55",
          side === "top" ? "h-auto" : "h-full",
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
            "absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-foreground/10 to-transparent",
            side === "right" ? null : "hidden",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-foreground/10 to-transparent",
            side === "left" ? null : "hidden",
          )}
        />
        <div
          className={cn(
            "absolute inset-x-10 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/14 to-transparent",
            side === "top" ? null : "hidden",
          )}
        />
        <div
          className={cn(
            "absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-foreground/14 to-transparent",
            side === "bottom" ? null : "hidden",
          )}
        />

        <div
          className={cn(
            "flex flex-col",
            side === "top" ? null : "h-full",
            side === "top"
              ? "px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-[calc(env(safe-area-inset-bottom)+1.25rem)]"
              : "px-6 pt-6 pb-8",
          )}
        >
          <div className="flex items-start">
            {header ?? (
              <div className="select-none text-xs font-medium tracking-[0.22em] text-muted-foreground">
                MENU
              </div>
            )}
          </div>

          <div className={cn(side === "top" ? "mt-6" : "mt-10")}>
            <div className="text-[11px] font-medium tracking-[0.24em] text-muted-foreground">
              NAVIGATION
            </div>

            <nav className={cn(side === "top" ? "mt-3 space-y-1.5" : "mt-4 space-y-2")}>
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
                      itemsMotionOpen
                        ? side === "right" || side === "left"
                          ? "opacity-100 translate-x-0 translate-y-0"
                          : "opacity-100 translate-x-0 translate-y-0"
                        : side === "right"
                          ? "opacity-0 translate-x-6 translate-y-0"
                          : side === "left"
                            ? "opacity-0 -translate-x-6 translate-y-0"
                            : "opacity-0 -translate-y-2 translate-x-0",
                    )}
                    style={
                      enableStagger
                        ? ({
                          "--menu-delay": open
                            ? `${80 + index * 60}ms`
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

          {!isDesktop && footer ? <div className="mt-8">{footer}</div> : null}
        </div>
      </div>
    </Sheet>
  );
}

export default React.memo(MenuOverlay);
