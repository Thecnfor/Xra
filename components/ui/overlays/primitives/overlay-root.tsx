"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type OverlayRootProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  portalTargetId?: string;
  zIndexClassName?: string;
};

export function OverlayRoot({
  open,
  children,
  className,
  portalTargetId,
  zIndexClassName = "z-[80]",
}: OverlayRootProps) {
  const node = (
    <div
      className={cn(
        "fixed inset-0",
        zIndexClassName,
        open ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );

  if (!portalTargetId) return node;
  if (typeof document === "undefined") return node;

  const target = document.getElementById(portalTargetId);
  if (!target) return node;

  return createPortal(node, target);
}

