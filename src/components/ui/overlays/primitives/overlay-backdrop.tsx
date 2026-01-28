"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type OverlayBackdropProps = {
  open: boolean;
  visible: boolean;
  className?: string;
  closeOnPointerDown?: boolean;
  onDismiss?: () => void;
};

export function OverlayBackdrop({
  open,
  visible,
  className,
  closeOnPointerDown = true,
  onDismiss,
}: OverlayBackdropProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-sidebar ease-curve-sidebar motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      onPointerDown={(e) => {
        if (!open) return;
        if (!closeOnPointerDown) return;
        if (e.target !== e.currentTarget) return;
        onDismiss?.();
      }}
    />
  );
}
