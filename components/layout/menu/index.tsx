"use client";

import * as React from "react";
import { selectMenuOpen, selectSetMenuOpen, useAppStore } from "@/stores";
import { MenuOverlay, type MenuOverlayProps } from "@/overlays";
import { menuItems } from "./menu-items";

type SiteMenuProps = {
  className?: string;
  panelProps?: Omit<MenuOverlayProps, "open" | "onClose" | "items"> & {
    items?: MenuOverlayProps["items"];
  };
};

export default function SiteMenu({ className, panelProps }: SiteMenuProps) {
  const open = useAppStore(selectMenuOpen);
  const setOpen = useAppStore(selectSetMenuOpen);

  const close = React.useCallback(() => setOpen(false), [setOpen]);

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
