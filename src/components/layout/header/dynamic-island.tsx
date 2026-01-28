"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  OverlayBackdrop,
  OverlayContent,
  OverlayRoot,
  useOverlayControls,
} from "@/components/ui/overlays";

export type IslandMessage = {
  id: string;
  title?: string;
  summary: string;
  detail?: string;
  href?: string;
  receivedAt?: number;
};

export type DynamicIslandPhase = "ball" | "pill";
export type DynamicIslandDevice = "mobile" | "desktop";

export type DynamicIslandProps = {
  message: IslandMessage | null;
  phase: DynamicIslandPhase;
  expanded: boolean;
  device: DynamicIslandDevice;
  recentMessages?: IslandMessage[];
  className?: string;
  onExpand?: () => void;
  onCollapse?: () => void;
  onDismiss?: () => void;
  onSelectMessage?: (id: string) => void;
  onInteractionChange?: (interacting: boolean) => void;
};

function formatTime(value?: number) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

export function DynamicIsland({
  message,
  phase,
  expanded,
  device,
  recentMessages,
  className,
  onExpand,
  onCollapse,
  onDismiss,
  onSelectMessage,
  onInteractionChange,
}: DynamicIslandProps) {
  const closeExpanded = React.useCallback(() => onCollapse?.(), [onCollapse]);
  const { initialFocusRef } = useOverlayControls(expanded, closeExpanded);
  const [motionOpen, setMotionOpen] = React.useState(false);
  const time = formatTime(message?.receivedAt);

  React.useEffect(() => {
    if (!expanded) {
      setMotionOpen(false);
      return;
    }
    setMotionOpen(false);
    const raf = window.requestAnimationFrame(() => setMotionOpen(true));
    return () => window.cancelAnimationFrame(raf);
  }, [expanded]);

  if (!message) return null;

  const layoutId = `dynamic-island-${message.id}`;
  const previewPillClassName =
    "h-11 max-w-[min(22rem,calc(100vw-12rem))] sm:max-w-[min(28rem,calc(100vw-16rem))] px-4";
  const desktopPillClassName =
    "h-11 max-w-[min(28rem,calc(100vw-16rem))] px-4";

  return (
    <>
      <AnimatePresence initial={false}>
        {!expanded ? (
          <motion.button
            key={`preview-${message.id}`}
            type="button"
            layoutId={layoutId}
            layout
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 520, damping: 34 }}
            aria-label="打开即时消息"
            onClick={() => onExpand?.()}
            onPointerEnter={() => onInteractionChange?.(true)}
            onPointerLeave={() => onInteractionChange?.(false)}
            onFocus={() => onInteractionChange?.(true)}
            onBlur={() => onInteractionChange?.(false)}
            className={cn(
              "relative inline-flex items-center rounded-full surface-glass text-foreground/90 shadow-sm shadow-black/5 dark:shadow-black/30",
              "transition-colors duration-300 ease-out hover:bg-background/55 focus-ring",
              "motion-reduce:transition-none",
              phase === "ball"
                ? "h-3.5 w-3.5 p-0"
                : device === "desktop"
                  ? desktopPillClassName
                  : previewPillClassName,
              className,
            )}
            style={{ borderRadius: 9999 }}
          >
            <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-linear-to-r from-transparent via-foreground/14 to-transparent" />
            <div
              className={cn(
                "flex min-w-0 items-center gap-3",
                phase === "ball" ? "opacity-0" : "opacity-100",
              )}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
              <motion.div
                key={`${message.id}-${phase}`}
                initial={{ opacity: phase === "ball" ? 0 : 0 }}
                animate={{ opacity: phase === "pill" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 truncate text-sm font-medium tracking-tight"
              >
                {message.summary}
              </motion.div>
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <OverlayRoot open={expanded} zIndexClassName="z-[95]">
        <OverlayBackdrop
          open={expanded}
          visible={motionOpen}
          className="bg-black/20 backdrop-blur-[2px]"
          onDismiss={closeExpanded}
        />

        <AnimatePresence initial={false}>
          {expanded ? (
            <OverlayContent
              key={`expanded-${message.id}`}
              ref={initialFocusRef}
              label="即时消息"
              tabIndex={-1}
              className="absolute left-1/2 top-[calc(env(safe-area-inset-top)+1.25rem+22px)] -translate-x-1/2 -translate-y-1/2"
              onPointerEnter={() => onInteractionChange?.(true)}
              onPointerLeave={() => onInteractionChange?.(false)}
            >
              <motion.div
                layoutId={layoutId}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 520, damping: 40 }}
                className={cn(
                  "relative w-[min(36rem,calc(100vw-2.5rem))] rounded-3xl surface-glass text-foreground/90 shadow-lg shadow-black/10 dark:shadow-black/35",
                  "overflow-hidden",
                )}
              >
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-foreground/14 to-transparent" />

                <div className="flex items-start gap-3 px-5 pt-4 pb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                      <div className="min-w-0 truncate text-sm font-semibold tracking-tight">
                        {message.title ?? "即时消息"}
                      </div>
                      {time ? (
                        <div className="shrink-0 text-xs text-foreground/50">
                          {time}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-1 text-sm text-foreground/80">
                      {message.summary}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="关闭"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/8 hover:text-foreground focus-ring"
                    onClick={closeExpanded}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {message.detail ? (
                  <div className="px-5 pb-4 text-sm text-foreground/75">
                    {message.detail}
                  </div>
                ) : null}

                {(message.href || (recentMessages?.length ?? 0) > 0) ? (
                  <div className="px-5 pb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {message.href ? (
                        <a
                          href={message.href}
                          className="inline-flex h-9 items-center rounded-full bg-foreground/8 px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/12 focus-ring"
                        >
                          查看
                        </a>
                      ) : null}
                      <button
                        type="button"
                        className="inline-flex h-9 items-center rounded-full bg-foreground/8 px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/12 focus-ring"
                        onClick={() => onDismiss?.()}
                      >
                        清除
                      </button>
                    </div>

                    {(recentMessages?.length ?? 0) > 1 ? (
                      <div className="mt-4">
                        <div className="mb-2 text-xs font-medium tracking-tight text-foreground/55">
                          最近
                        </div>
                        <div className="space-y-1">
                          {recentMessages
                            ?.filter((m) => m.id !== message.id)
                            .slice(0, 5)
                            .map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-foreground/6 focus-ring"
                                onClick={() => onSelectMessage?.(m.id)}
                              >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/25" />
                                <span className="min-w-0 flex-1 truncate">
                                  {m.summary}
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </motion.div>
            </OverlayContent>
          ) : null}
        </AnimatePresence>
      </OverlayRoot>
    </>
  );
}
