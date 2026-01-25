"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { XraCenterStage } from "@/components/layout/XRA";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  selectChatOpen,
  selectCloseSidePanel,
  selectIsRouteLoading,
  selectOpenSidePanel,
  useAppStore,
} from "@/stores";
import XrakChatSheet from "../panels/XrakChatSheet.client";
import { useDockInsets } from "./hooks/use-dock-insets";
import { useElementSize } from "./hooks/use-element-size";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";
import { useVisualViewport } from "./hooks/use-visual-viewport";
import { carrierTransition } from "./motion/carrier-motion";

export default function XrakCarrierOverlay() {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const chatOpen = useAppStore(selectChatOpen);
  const isRouteLoading = useAppStore(selectIsRouteLoading);
  const openSidePanel = useAppStore(selectOpenSidePanel);
  const closeSidePanel = useAppStore(selectCloseSidePanel);

  const stageLayoutRef = React.useRef<HTMLDivElement | null>(null);
  const dockInsetRef = React.useRef<HTMLDivElement | null>(null);

  const viewport = useVisualViewport();
  const stageSize = useElementSize(stageLayoutRef);
  const dockInsets = useDockInsets(dockInsetRef);
  const isHome = pathname === "/";

  const baseMarginRight = 20;
  const baseMarginBottom = 20;

  const resolvedInsets = React.useMemo(
    () => ({
      right: Math.max(baseMarginRight, dockInsets.right),
      bottom: Math.max(baseMarginBottom, dockInsets.bottom),
    }),
    [dockInsets.right, dockInsets.bottom],
  );

  const clampNumber = React.useCallback((value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
  }, []);

  const w = stageSize.width || 1;
  const h = stageSize.height || 1;
  const vw = viewport.width || 1;
  const vh = viewport.height || 1;

  const desiredDockPx = isDesktop ? 84 : 56;
  const baseSize = Math.max(1, Math.min(w, h));
  const dockScale = clampNumber(desiredDockPx / baseSize, 0.1, 0.22);
  const targetScale = isHome ? 1 : dockScale;

  const targetX = isHome ? 0 : vw / 2 - resolvedInsets.right - (w * targetScale) / 2;
  const targetY = isHome ? 0 : vh / 2 - resolvedInsets.bottom - (h * targetScale) / 2;

  const openChat = React.useCallback(() => openSidePanel("chat"), [openSidePanel]);
  const closeChat = React.useCallback(() => closeSidePanel(), [closeSidePanel]);

  const motionReady =
    viewport.width > 0 && viewport.height > 0 && stageSize.width > 0 && stageSize.height > 0;

  return (
    <>
      <div
        ref={dockInsetRef}
        className="fixed right-[calc(env(safe-area-inset-right)+1.25rem)] bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] h-px w-px"
        aria-hidden="true"
      />

      <motion.div
        initial={false}
        className="fixed -translate-x-1/2 -translate-y-1/2 z-[70] pointer-events-none"
        animate={{
          x: targetX,
          y: targetY,
          scale: targetScale,
          opacity: motionReady ? 1 : 0,
        }}
        transition={
          prefersReducedMotion || !motionReady
            ? { duration: 0 }
            : carrierTransition
        }
        style={{ transformOrigin: "center", left: "50vw", top: "50dvh" }}
      >
        <div className="pointer-events-auto">
          <div ref={stageLayoutRef}>
            <XraCenterStage
              className="select-none"
              forceHover={!isHome}
              baseRadius={isDesktop ? 0.72 : 0.64}
              onActivate={isRouteLoading ? undefined : isHome ? undefined : openChat}
              onLongPress={openChat}
            />
          </div>
        </div>
      </motion.div>

      <XrakChatSheet
        open={chatOpen}
        onClose={closeChat}
        desktopSide={pathname === "/" ? "right" : "left"}
      />
    </>
  );
}
