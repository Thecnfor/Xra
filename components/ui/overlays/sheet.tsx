"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useOverlayBehavior, usePresence } from "@/hooks/overlays";
import { OverlayBackdrop } from "./primitives/overlay-backdrop";
import { OverlayContent } from "./primitives/overlay-content";
import { OverlayRoot } from "./primitives/overlay-root";

export type SheetSide = "top" | "right" | "left" | "bottom";

export type SheetProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  side: SheetSide;
  label?: string;
  overlayClassName?: string;
  panelClassName?: string;
  exitMs?: number;
  unmountOnClose?: boolean;
  closeOnOverlayPointerDown?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
};

function getPanelPlacement(side: SheetSide) {
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

function Sheet({
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
  closeOnEscape = true,
  lockScroll = true,
  restoreFocus = true,
  initialFocusRef,
  children,
}: SheetProps) {
  const presence = usePresence(open, exitMs);
  const shouldRender = unmountOnClose ? presence : true;
  const placement = getPanelPlacement(side);
  const [motionOpen, setMotionOpen] = React.useState(false);
  const fallbackFocusRef = React.useRef<HTMLDivElement | null>(null);
  const resolvedFocusRef = initialFocusRef ?? fallbackFocusRef;

  useOverlayBehavior({
    open,
    onClose,
    initialFocusRef: resolvedFocusRef,
    closeOnEscape,
    lockScroll,
    restoreFocus,
  });

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
    <OverlayRoot open={open} className={className}>
      <OverlayBackdrop
        open={open}
        visible={motionOpen}
        className={overlayClassName}
        closeOnPointerDown={closeOnOverlayPointerDown}
        onDismiss={onClose}
      />

      <OverlayContent
        ref={resolvedFocusRef}
        label={label}
        tabIndex={-1}
        className={cn(
          "absolute will-change-[translate] transition-[translate,opacity] duration-sidebar ease-curve-sidebar motion-reduce:transition-none",
          placement.placement,
          motionOpen ? placement.openClass : placement.closedClass,
          panelClassName,
        )}
      >
        {children}
      </OverlayContent>
    </OverlayRoot>
  );
}

export default React.memo(Sheet);
