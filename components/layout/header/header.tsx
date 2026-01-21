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
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[90] flex items-center justify-between p-6 pointer-events-none",
          className,
        )}
      >
        <div className="pointer-events-auto flex items-center">
          {left ?? <DefaultLeft />}
        </div>

        <div className="pointer-events-auto flex items-center">
          {right ?? <HeaderActions />}
        </div>
      </header>

      <div className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-center p-6 pointer-events-none">
        <div className="pointer-events-auto">
          <DynamicIsland>{center}</DynamicIsland>
        </div>
      </div>
    </>
  );
}

function DefaultLeft() {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold">
      XRAK
    </div>
  );
}
