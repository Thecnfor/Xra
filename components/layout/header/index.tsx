import * as React from "react";
import { cn } from "@/lib/utils";
import { DynamicIsland } from "./dynamic-island";
import { HeaderActions } from "./header-actions";
import { XRAK } from "./header-logo";
import { ResponsivePortal } from "@/components/ui/overlays";

export function SiteHeader({
  right,
  center,
  className,
}: {
  right?: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
}) {
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
            <ResponsivePortal
              query="(min-width: 640px)"
              whenTrueTargetId="site-header-left-desktop"
              whenFalseTargetId="site-header-left-mobile"
            >
              <XRAK />
            </ResponsivePortal>
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
