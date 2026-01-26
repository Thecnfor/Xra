import * as React from "react";
import { cn } from "@/lib/utils";
import { HeaderNav } from "./header-nav";
import { XRAK } from "./header-logo";
import { RealtimeIsland } from "./realtime-island";
import { AnimatedThemeToggler } from "@/hooks/theme";
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
    "mx-auto w-full px-4 pt-[calc(env(safe-area-inset-top)+0.95rem)] pb-3 sm:px-6 sm:pt-[calc(env(safe-area-inset-top)+1.25rem)] sm:pb-4";

  return (
    <>
      <header
        className={cn(
          "xra-site-header fixed top-0 left-0 right-0 z-90 pointer-events-none",
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
              <div className="flex items-center gap-2">
                <AnimatedThemeToggler
                  aria-label="切换主题"
                  className="group relative hidden h-11 w-11 select-none items-center justify-center rounded-full border border-transparent bg-transparent text-foreground/80 backdrop-blur-none transition-colors duration-300 ease-out hover:bg-foreground/6 hover:text-foreground cursor-pointer focus-ring sm:inline-flex [&>svg]:h-5 [&>svg]:w-5"
                />
                <MenuButton />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="xra-site-header fixed top-0 left-0 right-0 z-72 pointer-events-none">
        <div className={containerClassName}>
          <div className="relative flex h-11 items-center">
            <div
              id="site-header-left-mobile"
              className="pointer-events-auto flex h-11 items-center sm:hidden"
            >
              <XRAK />
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
