"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/provider";
import {
  selectIsSidebarDrawerOpen,
  selectIsXraBranchActive,
  selectToggleSidebarDrawer,
} from "@/stores/selectors";
import { HeaderNav } from "./header-nav";
import { XRAK } from "./header-logo";
import { RealtimeIsland } from "./realtime-island";
import { AnimatedThemeToggler } from "@/hooks/theme";
import MenuButton from "@/components/features/meta/menu";

// --- Components ---

const IconSidebarOpen = () => (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.47108 18.9992 8.26339 19 9.4 19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H9.4C8.26339 5 7.47108 5.00078 6.85424 5.05118ZM7 7C7.55229 7 8 7.44772 8 8V16C8 16.5523 7.55229 17 7 17C6.44771 17 6 16.5523 6 16V8C6 7.44772 6.44771 7 7 7Z"
    fill="currentColor"
  />
);

const IconSidebarClosed = () => (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.17922 18.9754 7.55292 18.9882 8 18.9943V5.0057C7.55292 5.01184 7.17922 5.02462 6.85424 5.05118ZM10 5V19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H10Z"
    fill="currentColor"
  />
);

const SidebarTrigger = () => {
  const isSidebarDrawerOpen = useAppStore(selectIsSidebarDrawerOpen);
  const toggleSidebarDrawer = useAppStore(selectToggleSidebarDrawer);

  return (
    <button
      type="button"
      aria-controls="sidebar-drawer"
      aria-expanded={isSidebarDrawerOpen}
      onClick={toggleSidebarDrawer}
      className="p-xs text-primary-44 scale-inline-100 cursor-pointer transition-colors"
      aria-label="切换导航侧边栏"
    >
      <svg width="18" height="18" className="text-gray-400 hover:text-black dark:hover:text-white duration-sidebar ease-curve-sidebar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isSidebarDrawerOpen ? <IconSidebarOpen /> : <IconSidebarClosed />}
      </svg>
    </button>
  );
};

const DesktopHeaderLeft = () => {
  const isXraBranchActive = useAppStore(selectIsXraBranchActive);

  return (
    <div
      id="site-header-left-desktop"
      className="hidden w-fit items-center gap-10 pointer-events-auto sm:flex"
    >
      <XRAK className="hidden sm:flex" />
      {!isXraBranchActive && (
        <>
          <div className="h-4 w-px bg-border/60 hidden sm:block" />
          <HeaderNav className="hidden sm:flex" />
        </>
      )}
      {isXraBranchActive && <SidebarTrigger />}
    </div>
  );
};

const MobileHeaderLeft = () => {
  const isXraBranchActive = useAppStore(selectIsXraBranchActive);

  return (
    <div
      id="site-header-left-mobile"
      className="flex w-fit h-11 items-center gap-5 pointer-events-auto sm:hidden"
    >
      <XRAK />
      {/* 移动端仅显示 Logo，移除 HeaderNav */}
      {isXraBranchActive && <SidebarTrigger />}
    </div>
  );
};

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
    "mx-auto w-full px-4 pt-[calc(env(safe-area-inset-top)+var(--header-pt))] pb-[var(--header-pb)] sm:px-6";

  return (
    <>
      {/* 导航栏背景层 - 降低 z-index 使其位于菜单遮罩下方 */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-60 pointer-events-none",
          "bg-background/30 backdrop-blur-xl",
          className,
        )}
      >
        {/* 使用 containerClassName 撑开高度，确保背景模糊在桌面端也生效 */}
        <div className={containerClassName}>
          <div className="sm:hidden">
            <MobileHeaderLeft />
          </div>
          {/* 桌面端背景占位，确保高度一致 */}
          <div className="hidden h-11 sm:block" />
        </div>
      </div>

      <header
        className={cn(
          "xra-site-header fixed top-0 left-0 right-0 z-90 pointer-events-none",
          className,
        )}
      >
        <div className={cn("flex items-center", containerClassName)}>
          {/* 桌面端 Logo/Nav 容器 - 保持在 z-90，不被菜单遮挡 */}
          <div className="hidden sm:block">
            <DesktopHeaderLeft />
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
          <div className="flex h-11 items-center justify-center pointer-events-none">
            <div className="pointer-events-auto w-fit max-w-full">
              {center ?? <RealtimeIsland />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
