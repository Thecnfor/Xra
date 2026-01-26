"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

import { CallToAction } from "./CallToAction";
import { FeatureGrid } from "./FeatureGrid";
import { useSubtitleStream } from "./useSubtitleStream";

const SUBTITLE_SCRIPT: readonly string[] = [
  "Xra 正在对齐感知流…",
  "把注意力放在中心：那不是图标，是一颗会呼吸的介质。",
  "AI 不在屏幕里，它在你与世界之间。",
  "具身智能：输入不是指令，是意图；输出不是答案，是行动。",
  "让字幕像呼吸一样出现，让消失像记忆一样退场。",
  "按住 Xra：打开聊天；轻触：唤醒。",
];

const STAGE_SIZE = "var(--xra-home-stage-size, clamp(320px, 60vmin, 720px))";

export function HeroSection() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const maxLines = isDesktop ? 10 : 6;
  const lines = useSubtitleStream({ script: SUBTITLE_SCRIPT, maxLines });

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(80vmax 60vmax at 50% var(--xra-home-stage-y, 50dvh), rgba(127,127,127,0.06), transparent 60%)",
        }}
      />

      <div
        aria-hidden="true"
        className="fixed left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: STAGE_SIZE, height: STAGE_SIZE, top: "var(--xra-home-stage-y, 50dvh)" }}
      >
        <div
          className={[
            "absolute inset-0 rounded-full",
            prefersReducedMotion ? "" : "animate-[xra-breathe_6.6s_ease-in-out_infinite]",
            "bg-foreground/5 blur-3xl opacity-70 dark:bg-foreground/6 dark:opacity-55",
          ].join(" ")}
        />
        <div
          className={[
            "absolute -inset-[14%] rounded-full",
            prefersReducedMotion ? "" : "animate-[xra-pulse_7.8s_ease-in-out_infinite]",
            "xra-hero-orbit xra-hero-orbit-1 border opacity-70 blur-[0.2px]",
          ].join(" ")}
        />
        <div
          className={[
            "absolute -inset-[28%] rounded-full",
            prefersReducedMotion ? "" : "animate-[xra-pulse_9.8s_ease-in-out_infinite]",
            "xra-hero-orbit xra-hero-orbit-2 border opacity-55 blur-[0.2px]",
          ].join(" ")}
        />
      </div>

      {isDesktop ? (
        <div className="relative z-30 mx-auto flex w-full max-w-[1400px] flex-1 items-stretch">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-[minmax(260px,420px)_1fr_minmax(220px,420px)]">
            <aside className="relative">
              <FeatureGrid
                lines={lines}
                prefersReducedMotion={prefersReducedMotion}
                mode="desktop-left"
              />
            </aside>

            <div aria-hidden="true" />

            <div aria-hidden="true" className="hidden md:block" />
          </div>
        </div>
      ) : (
        <FeatureGrid
          lines={lines}
          prefersReducedMotion={prefersReducedMotion}
          mode="mobile-bottom"
        />
      )}

      <CallToAction prefersReducedMotion={prefersReducedMotion} />

      <style jsx global>{`
        .xra-hero-orbit {
          border-color: color-mix(in oklab, var(--foreground) 12%, transparent);
        }

        .xra-hero-orbit-1 {
          box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        }

        .xra-hero-orbit-2 {
          box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        }

        .dark .xra-hero-orbit {
          border-color: color-mix(in oklab, var(--foreground) 22%, transparent);
        }

        .dark .xra-hero-orbit-1 {
          box-shadow: 0 0 40px color-mix(in oklab, var(--foreground) 12%, transparent);
        }

        .dark .xra-hero-orbit-2 {
          box-shadow: 0 0 28px color-mix(in oklab, var(--foreground) 10%, transparent);
        }

        @keyframes xra-breathe {
          0%,
          100% {
            transform: scale(0.985);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.85;
          }
        }
        @keyframes xra-pulse {
          0%,
          100% {
            transform: scale(0.97);
            opacity: 0.24;
          }
          55% {
            transform: scale(1.03);
            opacity: 0.6;
          }
        }
        @keyframes xra-float {
          0%,
          100% {
            transform: translateY(0px) rotate(-1.2deg);
          }
          45% {
            transform: translateY(-10px) rotate(1.4deg);
          }
        }
        @keyframes xra-cursor {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.85;
          }
        }

        @media (max-width: 763px) {
          .home-footer {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
