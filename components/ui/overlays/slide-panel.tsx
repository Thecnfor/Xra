"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/overlays";

export type SlidePanelSide = "top" | "right" | "left" | "bottom";

export type SlidePanelProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  side: SlidePanelSide;
  label?: string;
  overlayClassName?: string;
  panelClassName?: string;
  exitMs?: number;
  unmountOnClose?: boolean;
  closeOnOverlayPointerDown?: boolean;
  children: React.ReactNode;
};

function getPanelPlacement(side: SlidePanelSide) {
  switch (side) {
    case "top":
      return {
        placement: "left-0 top-0 h-[min(560px,100dvh)] w-full",
        openClass: "translate-y-0",
        closedClass: "-translate-y-full",
      };
    case "bottom":
      return {
        placement: "left-0 bottom-0 h-[min(560px,100dvh)] w-full",
        openClass: "translate-y-0",
        closedClass: "translate-y-full",
      };
    case "left":
      return {
        placement: "left-0 top-0 h-full w-[min(440px,100vw)]",
        openClass: "translate-x-0",
        closedClass: "-translate-x-full",
      };
    case "right":
    default:
      return {
        placement: "right-0 top-0 h-full w-[min(440px,100vw)]",
        openClass: "translate-x-0",
        closedClass: "translate-x-full",
      };
  }
}

function SlidePanel({
  className,
  open,
  onClose,
  side,
  label = "面板",
  overlayClassName,
  panelClassName,
  exitMs = 640,
  unmountOnClose = true,
  closeOnOverlayPointerDown = true,
  children,
}: SlidePanelProps) {
  const presence = usePresence(open, exitMs);
  const shouldRender = unmountOnClose ? presence : true;
  const placement = getPanelPlacement(side);
  const [motionOpen, setMotionOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setMotionOpen(false);
      return;
    }

    setMotionOpen(false);
    const raf = window.requestAnimationFrame(() => setMotionOpen(true));
    return () => window.cancelAnimationFrame(raf);
  }, [open, side]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80]",
        open ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-[opacity] duration-sidebar ease-curve-sidebar motion-reduce:transition-none",
          motionOpen ? "opacity-100" : "opacity-0",
          overlayClassName,
        )}
        onPointerDown={(e) => {
          if (!open) return;
          if (!closeOnOverlayPointerDown) return;
          if (e.target === e.currentTarget) onClose();
        }}
      />

      <div
        className={cn(
          "absolute will-change-[translate] transition-[translate,opacity] duration-sidebar ease-curve-sidebar motion-reduce:transition-none",
          placement.placement,
          motionOpen ? placement.openClass : placement.closedClass,
          panelClassName,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}

export default React.memo(SlidePanel);
