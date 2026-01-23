"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

export type HeaderLeftPortalProps = {
  children: React.ReactNode;
  desktopSlotId: string;
  mobileSlotId: string;
  desktopQuery?: string;
};

export function HeaderLeftPortal({
  children,
  desktopSlotId,
  mobileSlotId,
  desktopQuery = "(min-width: 640px)",
}: HeaderLeftPortalProps) {
  const isDesktop = useMediaQuery(desktopQuery);
  if (typeof document === "undefined") return children;

  const target = document.getElementById(isDesktop ? desktopSlotId : mobileSlotId);
  if (!target) return children;

  return createPortal(children, target);
}
