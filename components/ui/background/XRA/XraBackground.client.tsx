"use client";

import React, { useEffect, useMemo, useRef } from "react";
import type { Force } from "d3-force";
import { forceCenter, forceCollide, forceSimulation, forceX, forceY } from "d3-force";
import { cn } from "@/lib/utils";

export type XraBackgroundProps = {
  className?: string;
};

type SphereNode = {
  id: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  strength: number;
  alpha: number;
  tint: "paper" | "cool" | "warm";
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function createSphereNodes(seed = 0x585241) {
  const rand = mulberry32(seed);
  const count = 12;
  const nodes: SphereNode[] = [];
  for (let i = 0; i < count; i += 1) {
    const u = rand();
    const v = rand();
    const r = Math.round(90 + rand() * 160);
    const tintRoll = rand();
    const tint: SphereNode["tint"] =
      tintRoll < 0.72 ? "paper" : tintRoll < 0.88 ? "cool" : "warm";
    const alpha = 0.08 + rand() * 0.12;
    nodes.push({
      id: `xra-sphere-${i}`,
      r,
      x: (u - 0.5) * 1200,
      y: (v - 0.5) * 800,
      vx: (rand() - 0.5) * 0.9,
      vy: (rand() - 0.5) * 0.9,
      strength: 0.55 + rand() * 0.6,
      alpha,
      tint,
    });
  }
  return nodes;
}

function sphereBackground(tint: SphereNode["tint"]) {
  if (tint === "cool") {
    return `radial-gradient(circle at 28% 26%, rgba(255,255,255,0.82) 0%, rgba(214,233,255,0.34) 46%, rgba(214,233,255,0.0) 72%)`;
  }
  if (tint === "warm") {
    return `radial-gradient(circle at 28% 26%, rgba(255,255,255,0.82) 0%, rgba(255,230,210,0.30) 46%, rgba(255,230,210,0.0) 72%)`;
  }
  return `radial-gradient(circle at 28% 26%, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.26) 52%, rgba(255,255,255,0.0) 74%)`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type AvoidCenterForce = Force<SphereNode, undefined> & {
  center: (x: number, y: number) => AvoidCenterForce;
  radius: (r: number) => AvoidCenterForce;
};

function forceAvoidCenter(holeRadiusPx: number, paddingPx = 28) {
  let nodes: SphereNode[] = [];
  let cx = 0;
  let cy = 0;
  let holeRadius = holeRadiusPx;
  const force = ((alpha: number) => {
    const r0 = holeRadius + paddingPx;
    for (const node of nodes) {
      const dx = (node.x ?? 0) - cx;
      const dy = (node.y ?? 0) - cy;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const minDist = r0 + node.r * 0.55;
      if (dist < minDist) {
        const k = ((minDist - dist) / minDist) * alpha * 0.9;
        node.vx += (dx / dist) * k;
        node.vy += (dy / dist) * k;
      }
    }
  }) as AvoidCenterForce;

  force.initialize = (ns: SphereNode[]) => {
    nodes = ns;
  };
  force.center = (x: number, y: number) => {
    cx = x;
    cy = y;
    return force;
  };
  force.radius = (r: number) => {
    holeRadius = r;
    return force;
  };
  return force;
}

export default function XraBackground({ className }: XraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spheresRef = useRef<Array<HTMLDivElement | null>>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const nodes = useMemo(() => createSphereNodes(), []);
  const hole = useMemo(() => ({ base: 230, feather: 110 }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const simulation = forceSimulation<SphereNode>(nodes)
      .alpha(1)
      .alphaMin(0.02)
      .alphaDecay(0.04)
      .velocityDecay(0.22)
      .force(
        "collide",
        forceCollide<SphereNode>()
          .radius((d) => d.r * 0.56 + 14)
          .iterations(2),
      )
      .force("x", forceX<SphereNode>(0).strength((d) => 0.014 * d.strength))
      .force("y", forceY<SphereNode>(0).strength((d) => 0.014 * d.strength))
      .force("center", forceCenter(0, 0))
      .stop();

    const avoid = forceAvoidCenter(hole.base);
    simulation.force("avoidCenter", avoid);

    let width = 0;
    let height = 0;

    const setOverlayMask = () => {
      const holePx = Math.round(clamp(Math.min(width, height) * 0.23, 190, 280));
      const featherPx = Math.round(clamp(holePx * 0.55, 90, 150));
      hole.base = holePx;
      hole.feather = featherPx;
      avoid.radius(holePx);
      const maskValue = `radial-gradient(circle at center, transparent 0, transparent ${holePx}px, rgba(255,255,255,1) ${holePx + featherPx}px)`;
      const el = overlayRef.current;
      if (el) {
        el.style.setProperty("mask-image", maskValue);
        el.style.setProperty("-webkit-mask-image", maskValue);
      }
    };

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const cx = width / 2;
      const cy = height / 2;
      simulation.force("center", forceCenter(cx, cy));
      avoid.center(cx, cy);
      setOverlayMask();
      simulation.alpha(0.95).restart();
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let running = true;
    let t0 = performance.now();

    const frame = () => {
      if (!running) return;
      const now = performance.now();
      const t = (now - t0) / 1000;

      if (!prefersReducedMotion) {
        const cx = width / 2 + Math.sin(t * 0.13) * 16;
        const cy = height / 2 + Math.cos(t * 0.11) * 14;
        simulation.force("x", forceX<SphereNode>(cx).strength((d) => 0.006 * d.strength));
        simulation.force("y", forceY<SphereNode>(cy).strength((d) => 0.006 * d.strength));
      } else {
        simulation.force("x", forceX<SphereNode>(width / 2).strength((d) => 0.004 * d.strength));
        simulation.force("y", forceY<SphereNode>(height / 2).strength((d) => 0.004 * d.strength));
      }

      simulation.tick();

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i]!;
        const el = spheresRef.current[i];
        if (!el) continue;
        const x = (node.x ?? 0) - node.r;
        const y = (node.y ?? 0) - node.r;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        el.style.opacity = String(node.alpha);
      }

      raf = window.requestAnimationFrame(frame);
    };

    raf = window.requestAnimationFrame(frame);

    const onVisibility = () => {
      const shouldRun = document.visibilityState === "visible";
      running = shouldRun;
      if (running) {
        t0 = performance.now();
        raf = window.requestAnimationFrame(frame);
      } else {
        window.cancelAnimationFrame(raf);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      window.cancelAnimationFrame(raf);
      simulation.stop();
    };
  }, [nodes, hole]);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 -z-10 bg-background", className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0">
        {nodes.map((n, i) => (
          <div
            key={n.id}
            ref={(el) => {
              spheresRef.current[i] = el;
            }}
            className="absolute left-0 top-0 rounded-full blur-[72px] will-change-transform"
            style={{
              width: `${n.r * 2}px`,
              height: `${n.r * 2}px`,
              background: sphereBackground(n.tint),
              opacity: n.alpha,
              mixBlendMode: "multiply",
            }}
          />
        ))}
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-background/28 backdrop-blur-3xl"
        style={{ WebkitBackdropFilter: "blur(44px)" }}
      />

      <div className="absolute inset-0 bg-linear-to-b from-background/55 via-background/18 to-background/55" />
    </div>
  );
}
