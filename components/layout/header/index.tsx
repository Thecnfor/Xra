import * as React from "react";
import { cn } from "@/lib/utils";
import { DynamicIsland } from "./dynamic-island";
import { HeaderActions } from "./header-actions";
import { XRAK } from "./header-logo";
import { HeaderLeftPortal } from "./header-left-portal";

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
  const leftNode = left ?? <XRAK />;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[90] flex items-center justify-between p-6 pointer-events-none",
          className,
        )}
      >
        <div
          id="site-header-left-desktop"
          className="pointer-events-auto flex items-center"
        />

        <div className="pointer-events-auto flex items-center">
          {right ?? <HeaderActions />}
        </div>
      </header>

      <div className="fixed top-0 left-0 right-0 z-[70] p-6 pointer-events-none">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          <div id="site-header-left-mobile" className="pointer-events-auto justify-self-start">
            <HeaderLeftPortal
              desktopSlotId="site-header-left-desktop"
              mobileSlotId="site-header-left-mobile"
            >
              {leftNode}
            </HeaderLeftPortal>
          </div>
          <div className="pointer-events-auto justify-self-center">
            <DynamicIsland>{center}</DynamicIsland>
          </div>
          <div />
        </div>
      </div>
    </>
  );
}
