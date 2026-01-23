"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { selectMenuOpen, selectSetMenuOpen, useAppStore } from "@/stores";
import type { MenuOverlayProps } from "@/overlays";
import { menuItems } from "./menu-items";

const MenuOverlay = dynamic(
  () => import("@/overlays").then((m) => m.MenuOverlay),
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
  const setOpen = useAppStore(selectSetMenuOpen);
  const [enabled, setEnabled] = React.useState(open);

  const close = React.useCallback(() => setOpen(false), [setOpen]);

  React.useEffect(() => {
    if (!open) return;
    setEnabled(true);
  }, [open]);

  if (!enabled) return null;

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
