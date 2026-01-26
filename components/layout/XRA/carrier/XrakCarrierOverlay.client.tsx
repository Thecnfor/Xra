"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { XraCenterStage } from "@/components/layout/XRA";
import { useMediaQuery } from "@/hooks/use-media-query";
import gsap from "gsap";
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
  const mobileHeaderOffsetPx = 64;
  const homeMobileCenterY = vh * 0.26 + mobileHeaderOffsetPx;
  const homeMobileTargetY = homeMobileCenterY - vh / 2;
  const targetY = isHome ? (isDesktop ? 0 : homeMobileTargetY) : vh / 2 - resolvedInsets.bottom - (h * targetScale) / 2;

  React.useEffect(() => {
    const root = document.documentElement;
    if (!isHome || isDesktop) {
      root.style.removeProperty("--xra-home-stage-y");
      return;
    }
    root.style.setProperty("--xra-home-stage-y", `${homeMobileCenterY}px`);
    return () => {
      root.style.removeProperty("--xra-home-stage-y");
    };
  }, [homeMobileCenterY, isDesktop, isHome]);

  const openChat = React.useCallback(() => openSidePanel("chat"), [openSidePanel]);
  const closeChat = React.useCallback(() => closeSidePanel(), [closeSidePanel]);

  const motionReady =
    viewport.width > 0 && viewport.height > 0 && stageSize.width > 0 && stageSize.height > 0;

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
    const setScale = gsap.quickSetter(el, "scale", "number");
    const setVoice = gsap.quickSetter(el, "--xra-voice");
    const targetTau = 920;
    const beatTau = 280;
    const minScale = 1.0;
    const maxShell = 0.012;
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

      const idle = 0.055 + 0.018 * Math.sin(now * 0.00105);
      const base = clamp01(idle + state.value);
      const shaped = clamp01(Math.pow(base, 0.82));
      const phase = now * 0.0081;
      const wave = 0.5 + 0.5 * Math.sin(phase);

      const baseline = 0.07 + 0.06 * shaped;
      const amplitude = 0.08 + 0.22 * shaped;

      const timeSinceBeat = Math.max(0, now - state.lastBeatAt);
      const beatWave = Math.exp(-timeSinceBeat / 420) * Math.max(0, Math.sin(timeSinceBeat * 0.016));

      const raw = baseline + amplitude * wave + state.beat * 0.72 * beatWave;
      const e = clamp01(softClip(raw));

      const wobble =
        0.55 +
        0.45 * Math.sin(phase) +
        0.16 * Math.sin(phase * 1.9 + 1.2) +
        0.1 * Math.sin(phase * 3.1 + 2.4);
      const shell = minScale + maxShell * e * wobble;
      setScale(shell);
      setVoice(e.toFixed(4));

      window.dispatchEvent(new CustomEvent("xra:voice", { detail: { energy: e } }));

      raf = window.requestAnimationFrame(update);
    };

    raf = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  const baseRadius = isDesktop ? 0.78 : 0.8;
  const stageSizeCss = isHome && !isDesktop ? "clamp(220px, 52vmin, 420px)" : undefined;

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
            <div ref={typingScaleRef} className="xra-voice-shell">
              <XraCenterStage
                className="select-none"
                forceHover={!isHome}
                baseRadius={baseRadius}
                size={stageSizeCss}
                voiceEventName="xra:voice"
                onActivate={isRouteLoading ? undefined : isHome ? undefined : openChat}
                onLongPress={openChat}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .xra-voice-shell {
          --xra-voice: 0;
          position: relative;
        }

        .xra-voice-shell::before,
        .xra-voice-shell::after {
          content: none;
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
