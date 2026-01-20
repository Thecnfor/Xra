import * as React from "react";
import { cn } from "@/lib/utils";
import { DynamicIsland } from "./dynamic-island";
import { HeaderActions } from "./header-actions";

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
        "fixed top-0 left-0 right-0 z-[80] flex items-center justify-between p-6 pointer-events-none",
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
        {right ?? <HeaderActions />}
      </div>
    </header>
  );
}

function DefaultLeft() {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold">
      XRAK
    </div>
  );
}
