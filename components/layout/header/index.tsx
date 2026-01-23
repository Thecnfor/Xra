import * as React from "react";
import { cn } from "@/lib/utils";
import { HeaderNav } from "./header-nav";
import { XRAK } from "./header-logo";
import { RealtimeIsland } from "./realtime-island";
import { ResponsivePortal } from "@/overlays";
import MenuButton from "@/features/meta/menu";

export function SiteHeader({
  right,
  center,
  className,
}: {
  right?: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
}) {
  const containerClassName =
    "mx-auto w-full px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-4 sm:px-6";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-90 pointer-events-none",
          className,
        )}
      >
        <div className={cn("flex items-center", containerClassName)}>
          <div
            id="site-header-left-desktop"
            className="pointer-events-auto hidden items-center gap-6 sm:flex"
          >
            <XRAK className="hidden sm:flex" />
            <div className="h-4 w-px bg-border/60" />
            <HeaderNav />
          </div>

          <div className="pointer-events-auto ml-auto flex items-center">
            {right ?? (
              <MenuButton className="text-neutral-900 dark:text-neutral-100" />
            )}
          </div>
        </div>
      </header>

      <div className="fixed top-0 left-0 right-0 z-70 pointer-events-none">
        <div className={containerClassName}>
          <div className="relative flex h-11 items-center">
            <div
              id="site-header-left-mobile"
              className="pointer-events-auto flex h-11 items-center sm:hidden"
            >
              <div
                id="site-header-left-mobile-slot"
                className="flex h-full items-center"
              />
              <ResponsivePortal
                query="(min-width: 640px)"
                whenTrueTargetId="site-header-left-desktop-slot"
                whenFalseTargetId="site-header-left-mobile-slot"
              >
                <XRAK />
              </ResponsivePortal>
            </div>

            <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {center ?? <RealtimeIsland />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
