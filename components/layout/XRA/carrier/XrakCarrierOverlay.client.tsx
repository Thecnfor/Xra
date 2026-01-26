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
  const typingScaleRef = React.useRef<HTMLDivElement | null>(null);
  const energyRef = React.useRef({
    value: 0,
    target: 0,
    lastAt: 0,
    beat: 0,
    lastBeatAt: 0,
    pendingBeat: 0,
  });

  const viewport = useVisualViewport();
  const stageSize = useElementSize(stageLayoutRef);
  const dockInsets = useDockInsets(dockInsetRef);
  const isHome = pathname === "/";
  const isHomeCenter = isHome && isDesktop;

  const baseMarginRight = 28;
  const baseMarginBottom = 28;

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

  const [stable, setStable] = React.useState(() => ({
    w: 1,
    h: 1,
    vw: 0,
    vh: 0,
    rightInset: 20,
    bottomInset: 20,
  }));

  React.useEffect(() => {
    setStable((prev) => ({
      w: stageSize.width > 0 ? stageSize.width : prev.w,
      h: stageSize.height > 0 ? stageSize.height : prev.h,
      vw: viewport.width > 0 ? viewport.width : prev.vw,
      vh: viewport.height > 0 ? viewport.height : prev.vh,
      rightInset: resolvedInsets.right > 0 ? resolvedInsets.right : prev.rightInset,
      bottomInset: resolvedInsets.bottom > 0 ? resolvedInsets.bottom : prev.bottomInset,
    }));
  }, [
    resolvedInsets.bottom,
    resolvedInsets.right,
    stageSize.height,
    stageSize.width,
    viewport.height,
    viewport.width,
  ]);

  const w = stageSize.width || stable.w || 1;
  const h = stageSize.height || stable.h || 1;
  const vw = viewport.width || stable.vw || 0;
  const vh = viewport.height || stable.vh || 0;
  const rightInset = resolvedInsets.right || stable.rightInset || 20;
  const bottomInset = resolvedInsets.bottom || stable.bottomInset || 20;

  const desiredDockPx = isDesktop ? 56 : 40;
  const homeCenterStageSizeCss = "clamp(240px, 34vmin, 520px)";
  const stageSizeCss = isHomeCenter ? homeCenterStageSizeCss : `${desiredDockPx}px`;

  const effectiveW = isHomeCenter ? w : desiredDockPx;
  const effectiveH = isHomeCenter ? h : desiredDockPx;
  const motionReady = vw > 0 && vh > 0 && effectiveW > 0 && effectiveH > 0;

  const clampX = React.useCallback(
    (left: number, width: number) => {
      const max = Math.max(0, vw - width);
      return clampNumber(left, 0, max);
    },
    [clampNumber, vw],
  );

  const clampY = React.useCallback(
    (top: number, height: number) => {
      const max = Math.max(0, vh - height);
      return clampNumber(top, 0, max);
    },
    [clampNumber, vh],
  );

  const desiredLeft = isHomeCenter ? vw / 2 - effectiveW / 2 : vw - rightInset - effectiveW;
  const desiredTop = isHomeCenter ? vh / 2 - effectiveH / 2 : vh - bottomInset - effectiveH;

  const clampedLeft = isHomeCenter ? desiredLeft : clampX(desiredLeft, effectiveW);
  const clampedTop = isHomeCenter ? desiredTop : clampY(desiredTop, effectiveH);

  const targetX = clampedLeft - vw / 2;
  const targetY = clampedTop - vh / 2;

  const openChat = React.useCallback(() => openSidePanel("chat"), [openSidePanel]);
  const closeChat = React.useCallback(() => closeSidePanel(), [closeSidePanel]);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const onStream = (event: Event) => {
      const detail = (event as CustomEvent<{ deltaChars?: unknown; cps?: unknown }>).detail;
      const deltaChars = typeof detail?.deltaChars === "number" ? detail.deltaChars : 1;
      const cps = typeof detail?.cps === "number" ? detail.cps : 22;
      const impulse =
        Math.min(0.28, 0.07 + (Math.min(10, Math.max(1, deltaChars)) / 10) * 0.21) *
        Math.min(1.35, Math.max(0.85, cps / 20));
      const now = performance.now();
      const state = energyRef.current;
      state.lastAt = now;
      state.target = Math.min(1, state.target + impulse * 0.38);
      const beatGapMs = 260;
      if (now - state.lastBeatAt >= beatGapMs) {
        state.lastBeatAt = now;
        state.beat = Math.min(1, state.beat + impulse * 1.05 + state.pendingBeat);
        state.pendingBeat = 0;
      } else {
        state.pendingBeat = Math.min(1, state.pendingBeat + impulse * 0.42);
      }
    };
    window.addEventListener("xra:hero-stream", onStream as EventListener);
    return () => {
      window.removeEventListener("xra:hero-stream", onStream as EventListener);
    };
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    const el = typingScaleRef.current;
    if (!el) return;
    if (prefersReducedMotion) {
      el.style.transform = "scale(1)";
      return;
    }

    let raf = 0;
    const setScale = (value: number) => {
      el.style.transform = `scale(${value})`;
    };
    const targetTau = 920;
    const beatTau = 280;
    const minScale = 1.0;
    const maxShell = 0.0024;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const softClip = (v: number) => {
      const x = Math.max(0, v);
      const k = 1.45;
      const denom = Math.tanh(k);
      return denom <= 0 ? 0 : Math.tanh(x * k) / denom;
    };

    const update = (now: number) => {
      const state = energyRef.current;
      const dt = Math.max(0, now - (state.lastAt || now));
      state.lastAt = now;
      state.target = clamp01(state.target * Math.exp(-dt / targetTau));
      state.beat = clamp01(state.beat * Math.exp(-dt / beatTau));
      const target = state.target;
      const attack = 1 - Math.exp(-dt / 150);
      const release = 1 - Math.exp(-dt / 520);
      state.value = state.value + (target - state.value) * (target > state.value ? attack : release);

      const idle = 0.028 + 0.01 * Math.sin(now * 0.00105);
      const base = clamp01(idle + state.value);
      const shaped = clamp01(Math.pow(base, 0.82));
      const phase = now * 0.0081;
      const wave = 0.5 + 0.5 * Math.sin(phase);

      const baseline = 0.045 + 0.04 * shaped;
      const amplitude = 0.05 + 0.14 * shaped;

      const timeSinceBeat = Math.max(0, now - state.lastBeatAt);
      const beatWave = Math.exp(-timeSinceBeat / 420) * Math.max(0, Math.sin(timeSinceBeat * 0.016));

      const raw = baseline + amplitude * wave + state.beat * 0.42 * beatWave;
      const e = clamp01(softClip(raw));

      const wobble =
        0.55 +
        0.45 * Math.sin(phase) +
        0.16 * Math.sin(phase * 1.9 + 1.2) +
        0.1 * Math.sin(phase * 3.1 + 2.4);
      const shell = minScale + maxShell * e * wobble;
      setScale(shell);

      window.dispatchEvent(new CustomEvent("xra:voice", { detail: { energy: e } }));

      raf = window.requestAnimationFrame(update);
    };

    raf = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  const baseRadius = isDesktop ? 0.78 : 0.8;

  return (
    <>
      <div
        ref={dockInsetRef}
        className="fixed right-[calc(env(safe-area-inset-right)+1.5rem)] bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] h-px w-px"
        aria-hidden="true"
      />

      <div className="fixed left-[50vw] top-[50dvh] h-px w-px z-70 pointer-events-none">
        <motion.div
          initial={false}
          className="pointer-events-none"
          animate={{
            x: motionReady ? targetX : 0,
            y: motionReady ? targetY : 0,
            scale: 1,
            opacity: motionReady ? 1 : 0,
          }}
          transition={
            prefersReducedMotion || !motionReady
              ? { duration: 0 }
              : carrierTransition
          }
          style={{ transformOrigin: "top left" }}
        >
          <div className="pointer-events-auto">
            <div ref={stageLayoutRef}>
              <div ref={typingScaleRef} className="xra-voice-shell">
                <XraCenterStage
                  key={isHomeCenter ? "home" : "dock"}
                  className="select-none"
                  forceHover={!isHome}
                  interactive
                  colorRole="foreground"
                  baseRadius={baseRadius}
                  size={stageSizeCss}
                  voiceEventName="xra:voice"
                  onActivate={isRouteLoading ? undefined : isHomeCenter ? undefined : openChat}
                  onLongPress={isRouteLoading ? undefined : openChat}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .xra-voice-shell {
          position: relative;
          isolation: isolate;
        }
      `}</style>

      <XrakChatSheet
        open={chatOpen}
        onClose={closeChat}
        desktopSide={pathname === "/" ? "right" : "left"}
      />
    </>
  );
}
