"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { selectMenuOpen, selectCloseSidePanel, useAppStore } from "@/stores";
import type { MenuOverlayProps } from "@/components/ui/overlays";
import { menuItems } from "./menu-items";

const MenuOverlay = dynamic(
  () => import("@/components/ui/overlays").then((m) => m.MenuOverlay),
  { ssr: false },
);

type SiteMenuProps = {
  className?: string;
  panelProps?: Omit<MenuOverlayProps, "open" | "onClose" | "items"> & {
    items?: MenuOverlayProps["items"];
  };
};

export default function SiteMenu({ className, panelProps }: SiteMenuProps) {
  const open = useAppStore(selectMenuOpen);
  const closeSidePanel = useAppStore(selectCloseSidePanel);
  React.useEffect(() => {
    import("@/components/ui/overlays");
  }, []);

  const close = React.useCallback(() => closeSidePanel(), [closeSidePanel]);

  return (
    <MenuOverlay
      {...panelProps}
      className={className}
      open={open}
      onClose={close}
      items={panelProps?.items ?? menuItems}
    />
  );
}
