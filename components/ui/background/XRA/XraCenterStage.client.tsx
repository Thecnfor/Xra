"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const blobVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blobFragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uHover;
  uniform float uPress;
  uniform vec3 uColor;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float d = length(uv);
    float radius = 0.64 + uPress * 0.03;
    float edge = d - radius;

    float edgeMask = smoothstep(0.18, 0.02, abs(edge));

    float interaction = clamp(uHover + uPress, 0.0, 1.0);
    float boost = 1.0 + uPress * 1.25;

    vec2 p = uv * 3.2 + vec2(uTime * 0.18, uTime * 0.14);
    float n = fbm(p + uPointer * 0.9);
    float wobble = (n - 0.5) * 0.16 * interaction * edgeMask * boost;

    vec2 dir = normalize(uPointer + vec2(0.0001));
    float alignment = dot(normalize(uv + vec2(0.0001)), dir);
    float pinch = exp(-pow(1.0 - alignment, 2.0) * 14.0) * clamp(length(uPointer), 0.0, 1.0) * 0.12 * interaction * edgeMask * boost;

    float e = edge + wobble - pinch;
    float alpha = 1.0 - smoothstep(-0.008, 0.02, e);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function BlobPlane({
  hover,
  press,
  color,
  pointer,
}: {
  hover: React.MutableRefObject<number>;
  press: React.MutableRefObject<number>;
  color: React.MutableRefObject<THREE.Color>;
  pointer: React.MutableRefObject<THREE.Vector2>;
}) {
  const [uniforms] = useState<Record<string, THREE.IUniform>>(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uPress: { value: 0 },
    uColor: { value: new THREE.Color(0x000000) },
    uPointer: { value: new THREE.Vector2(0, 0) },
  }));

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uHover.value = hover.current;
    materialRef.current.uniforms.uPress.value = press.current;
    (materialRef.current.uniforms.uColor.value as THREE.Color).copy(color.current);
    (materialRef.current.uniforms.uPointer.value as THREE.Vector2).copy(pointer.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={uniforms}
        vertexShader={blobVertexShader}
        fragmentShader={blobFragmentShader}
      />
    </mesh>
  );
}

export function XraCenterStage({ className }: { className?: string }) {
  const hover = useRef(0);
  const press = useRef(0);
  const color = useRef(new THREE.Color(0x000000));
  const pointer = useRef(new THREE.Vector2(0, 0));
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const applyResolved = (resolved: "light" | "dark") => {
      color.current.set(resolved === "dark" ? 0xffffff : 0x000000);
    };

    applyResolved(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );

    const onThemeEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ resolved?: unknown }>).detail;
      const resolved = detail?.resolved === "dark" ? "dark" : "light";
      applyResolved(resolved);
    };

    window.addEventListener("xra:theme", onThemeEvent);
    return () => window.removeEventListener("xra:theme", onThemeEvent);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const clickRadius = 0.64;
    const pressCancelRadius = clickRadius + 0.08;
    const hoverRadius = 0.58;
    const hoverFallStart = hoverRadius * 0.8;
    const longPressMs = 420;

    let hoverTarget = hover.current;
    const setHover = (v: number) => {
      if (v === hoverTarget) return;
      hoverTarget = v;
      gsap.to(hover, {
        current: v,
        duration: 0.55,
        ease: v > hover.current ? "power3.out" : "power3.inOut",
      });
    };

    const normalizePointer = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = Math.max(1, Math.min(rect.width, rect.height) / 2);
      const x = (clientX - cx) / r;
      const y = (cy - clientY) / r;
      const len = Math.hypot(x, y);
      if (len <= 1) return { x, y, len };
      return { x: x / len, y: y / len, len };
    };

    let pressArmed = false;
    let activePointerId: number | null = null;
    let longPressTimer: number | null = null;
    let longPressed = false;

    const cancelLongPress = () => {
      if (longPressTimer == null) return;
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    };

    const resetPress = () => {
      pressArmed = false;
      activePointerId = null;
      longPressed = false;
      cancelLongPress();
      gsap.to(press, { current: 0, duration: 0.45, ease: "power3.out" });
    };

    const onEnter = (e: PointerEvent) => {
      if (pressArmed) return;
      const p = normalizePointer(e.clientX, e.clientY);
      setHover(p.len <= hoverRadius ? 1 : 0);
    };
    const onLeave = () => {
      if (pressArmed) return;
      gsap.to(pointer.current, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
      setHover(0);
    };
    const onMove = (e: PointerEvent) => {
      const p = normalizePointer(e.clientX, e.clientY);
      if (pressArmed && p.len > pressCancelRadius) {
        onCancel(e);
        return;
      }
      const hoverActive = pressArmed ? 1 : p.len <= hoverRadius ? 1 : 0;
      setHover(hoverActive);
      const edgeFalloff = 1 - THREE.MathUtils.smoothstep(p.len, hoverFallStart, hoverRadius);
      gsap.to(pointer.current, {
        x: p.x * 0.56 * edgeFalloff,
        y: p.y * 0.56 * edgeFalloff,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const onDown = (e: PointerEvent) => {
      const p = normalizePointer(e.clientX, e.clientY);
      if (p.len > clickRadius) return;
      e.preventDefault();
      pressArmed = true;
      activePointerId = e.pointerId;
      longPressed = false;
      setHover(1);
      host.setPointerCapture(e.pointerId);

      gsap.to(press, { current: 0.55, duration: 0.12, ease: "power2.out" });
      cancelLongPress();
      longPressTimer = window.setTimeout(() => {
        if (!pressArmed) return;
        longPressed = true;
        gsap.to(press, { current: 1, duration: 0.18, ease: "power3.out" });
      }, longPressMs);
    };

    const onUp = (e: PointerEvent) => {
      if (!pressArmed) return;
      if (activePointerId != null && e.pointerId !== activePointerId) return;
      e.preventDefault();
      cancelLongPress();
      if (host.hasPointerCapture(e.pointerId)) {
        host.releasePointerCapture(e.pointerId);
      }

      if (longPressed) {
        resetPress();
        return;
      }

      gsap.to(press, {
        current: 1,
        duration: 0.08,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(press, { current: 0, duration: 0.5, ease: "power3.out" });
        },
      });
      pressArmed = false;
      activePointerId = null;
      longPressed = false;
    };

    const onCancel = (e: PointerEvent) => {
      if (!pressArmed) return;
      if (activePointerId != null && e.pointerId !== activePointerId) return;
      e.preventDefault();
      if (host.hasPointerCapture(e.pointerId)) {
        host.releasePointerCapture(e.pointerId);
      }
      resetPress();
    };

    const onContextMenu = (e: MouseEvent) => {
      if (!pressArmed) return;
      e.preventDefault();
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onCancel);
    host.addEventListener("contextmenu", onContextMenu);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onCancel);
      host.removeEventListener("contextmenu", onContextMenu);
      resetPress();
    };
  }, []);

  return (
    <section className={cn("relative isolate flex w-full items-center justify-center", className)}>
      <div className="relative flex items-center justify-center">
        <div
          ref={hostRef}
          className="relative grid place-items-center"
          style={{
            width: "clamp(320px, 64vmin, 860px)",
            height: "clamp(320px, 64vmin, 860px)",
            touchAction: "none",
          }}
          role="img"
          aria-label="XRAK Studio interactive blob"
        >
          <Canvas
            orthographic
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 2], zoom: 120 }}
            gl={{ alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" }}
            className="absolute inset-0"
          >
            <BlobPlane hover={hover} press={press} color={color} pointer={pointer} />
          </Canvas>

          <h1 className="pointer-events-none relative z-10 select-none text-center text-white mix-blend-difference">
            <span className="block font-semibold leading-[0.86] tracking-[-0.06em] text-[clamp(52px,7.4vw,96px)] translate-x-[-0.06em]">
              XRAK
            </span>
            <span className="block font-medium uppercase leading-none tracking-[0.34em] text-[clamp(20px,2.3vw,30px)] translate-x-[0.12em] mt-2">
              Studio
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
