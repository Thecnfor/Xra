import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import type { SubtitleLine } from "./useSubtitleStream";

export function FeatureGrid({
  lines,
  prefersReducedMotion,
  mode = "desktop-left",
  className,
}: {
  lines: readonly SubtitleLine[];
  prefersReducedMotion: boolean;
  mode?: "desktop-left" | "mobile-bottom";
  className?: string;
}) {
  const containerClassName =
    mode === "mobile-bottom"
      ? "fixed left-4 right-4 bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] z-[65] max-h-[min(34dvh,18rem)] overflow-hidden pl-[3.25rem]"
      : "sticky top-[calc(env(safe-area-inset-top)+6.5rem)] max-h-[calc(100dvh-10.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] overflow-hidden";

  return (
    <div className={cn(containerClassName, className)}>
      <div className="flex flex-col gap-2 pr-2">
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              layout
              initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, x: -22, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 560, damping: 44, mass: 0.8 }}
              className="will-change-transform"
            >
              <p className="text-sm leading-relaxed text-foreground/82 tracking-[0.01em] md:text-[15px]">
                <span className="select-none">{line.text.slice(0, line.typed)}</span>
                {!line.done ? (
                  <span
                    aria-hidden="true"
                    className={[
                      "inline-block align-[-0.12em] text-foreground/60",
                      prefersReducedMotion ? "" : "animate-[xra-cursor_1.05s_ease-in-out_infinite]",
                    ].join(" ")}
                  >
                    ▍
                  </span>
                ) : null}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
