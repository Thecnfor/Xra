"use client";

import * as React from "react";
import { selectMenuOpen, selectSetMenuOpen, useAppStore } from "@/stores";
import { useOverlayControls } from "@/hooks/overlays";
import MenuPanel, { type MenuPanelProps } from "./menu-panel";

type SiteMenuProps = {
  className?: string;
  panelProps?: Omit<MenuPanelProps, "open" | "onClose" | "initialFocusRef">;
};

export default function SiteMenu({ className, panelProps }: SiteMenuProps) {
  const open = useAppStore(selectMenuOpen);
  const setOpen = useAppStore(selectSetMenuOpen);

  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const { initialFocusRef } = useOverlayControls(open, close);

  return (
    <MenuPanel
      {...panelProps}
      className={className}
      open={open}
      onClose={close}
      initialFocusRef={initialFocusRef}
    />
  );
}
