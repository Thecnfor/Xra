"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/features/meta/brand-logo";
import MenuButton from "@/components/features/meta/menu";

interface SiteHeaderProps {
  /** 左侧内容，默认为 Logo */
  left?: React.ReactNode;
  /** 右侧内容，默认为 菜单按钮 */
  right?: React.ReactNode;
  /** 中间灵动岛内容 */
  center?: React.ReactNode;
  className?: string;
}

export function SiteHeader({
  left,
  right,
  center,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 pointer-events-none",
        className,
      )}
    >
      {/* 左侧区域 */}
      <div className="pointer-events-auto relative z-20 flex items-center">
        {left ?? <DefaultLeft />}
      </div>

      {/* 中间灵动岛 - 绝对定位居中 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <DynamicIsland>{center}</DynamicIsland>
        </div>
      </div>

      {/* 右侧区域 */}
      <div className="pointer-events-auto relative z-20 flex items-center">
        {right ?? <DefaultRight />}
      </div>
    </header>
  );
}

function DefaultLeft() {
  return (
    <div className="flex items-center gap-2">
      <BrandLogo size="sm" />
    </div>
  );
}

function DefaultRight() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-center">
      <MenuButton
        checked={isOpen}
        onChange={setIsOpen}
        className="text-neutral-900 dark:text-neutral-100 scale-75"
      />
    </div>
  );
}

/**
 * 灵动岛组件
 * 支持展开/收缩动画，默认为黑色胶囊状
 */
function DynamicIsland({ children }: { children?: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
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
      <motion.div
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
      </motion.div>
    </motion.div>
  );
}
