"use client";

import * as React from "react";
import { LazyMotion, domMax, m } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * 灵动岛组件
 * 支持展开/收缩动画，默认为黑色胶囊状
 * 使用 LazyMotion 和 domMax 优化包体积
 */
export function DynamicIsland({ children }: { children?: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <LazyMotion features={domMax}>
      <m.div
        layout
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full bg-black/90 text-white shadow-2xl backdrop-blur-xl dark:bg-neutral-900/90 dark:border dark:border-white/10",
          "cursor-pointer transition-colors hover:bg-black",
        )}
        initial={{ width: 120, height: 40, opacity: 0, y: -20 }}
        animate={{
          width: isExpanded ? 300 : children ? 200 : 120,
          height: isExpanded ? 150 : 44,
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <m.div
          layout="position"
          className="flex items-center justify-center px-4 w-full h-full"
        >
          {children ? (
            <div className="w-full text-center text-sm font-medium opacity-90">
              {children}
            </div>
          ) : (
            /* 默认状态：简单的指示条或状态灯 */
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                System
              </span>
            </div>
          )}
        </m.div>
      </m.div>
    </LazyMotion>
  );
}
