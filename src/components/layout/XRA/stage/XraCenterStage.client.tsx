"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useWebglContextRecovery } from "./hooks/use-webgl-context-recovery";
import { blobFragmentShader, blobVertexShader } from "./shaders/blob";

function BlobPlane({
  hover,
  press,
  color,
  pointer,
  radius,
}: {
  hover: React.MutableRefObject<number>;
  press: React.MutableRefObject<number>;
  color: React.MutableRefObject<THREE.Color>;
  pointer: React.MutableRefObject<THREE.Vector2>;
  radius: React.MutableRefObject<number>;
}) {
  const [uniforms] = useState<Record<string, THREE.IUniform>>(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uPress: { value: 0 },
    uRadius: { value: 0.64 },
    uColor: { value: new THREE.Color(0x000000) },
    uPointer: { value: new THREE.Vector2(0, 0) },
  }));

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uHover.value = hover.current;
    materialRef.current.uniforms.uPress.value = press.current;
    materialRef.current.uniforms.uRadius.value = radius.current;
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

export type XraCenterStageProps = {
  className?: string;
  ariaLabel?: string;
  forceHover?: boolean;
  interactive?: boolean;
  baseRadius?: number;
  pressDrive?: number;
  voiceEventName?: string;
  size?: string;
  colorRole?: "foreground" | "background";
  onActivate?: () => void;
  onLongPress?: () => void;
};

export function XraCenterStage({
  className,
  ariaLabel = "XRak interactive blob",
  forceHover = false,
  interactive = true,
  baseRadius = 0.64,
  pressDrive,
  voiceEventName,
  size = "clamp(320px, 60vmin, 720px)",
  colorRole = "foreground",
  onActivate,
  onLongPress,
}: XraCenterStageProps) {
  const [canvasKey, setCanvasKey] = useState(0);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const updateCameraRef = useRef<() => void>(() => { });
  const hover = useRef(0);
  const press = useRef(0);
  const radius = useRef(baseRadius);
  const color = useRef(new THREE.Color(0x000000));
  const pointer = useRef(new THREE.Vector2(0, 0));
  const hostRef = useRef<HTMLDivElement | null>(null);
  const onActivateRef = useRef(onActivate);
  const onLongPressRef = useRef(onLongPress);
  const forceHoverRef = useRef(forceHover);
  const healRef = useRef({ windowStartMs: 0, attempts: 0 });
  const bumpCanvasKey = useCallback(() => setCanvasKey((k) => k + 1), []);

  useEffect(() => {
    onActivateRef.current = onActivate;
    onLongPressRef.current = onLongPress;
  }, [onActivate, onLongPress]);

  useEffect(() => {
    forceHoverRef.current = forceHover;
    if (forceHover) {
      hover.current = 1;
      return;
    }
    const host = hostRef.current;
    const isHovered = host ? host.matches(":hover") : false;
    if (!isHovered) {
      gsap.to(hover, { current: 0, duration: 0.45, ease: "power3.out", overwrite: true });
    }
  }, [forceHover]);

  useEffect(() => {
    radius.current = baseRadius;
  }, [baseRadius]);

  useEffect(() => {
    if (pressDrive == null) return;
    const v = Math.max(0, Math.min(1, pressDrive));
    const duration = v >= press.current ? 0.14 : 0.42;
    gsap.to(press, { current: v, duration, ease: "power3.out", overwrite: true });
  }, [pressDrive]);

  useEffect(() => {
    if (!voiceEventName) return;
    const state = { last: press.current };
    const onVoice = (event: Event) => {
      const detail = (event as CustomEvent<{ energy?: unknown }>).detail;
      const energy = typeof detail?.energy === "number" ? detail.energy : 0;
      const v = Math.max(0, Math.min(1, energy * 1.35));
      const duration = v >= state.last ? 0.18 : 0.55;
      state.last = v;
      gsap.to(press, { current: v, duration, ease: "power3.out", overwrite: true });
    };
    window.addEventListener(voiceEventName, onVoice as EventListener);
    return () => window.removeEventListener(voiceEventName, onVoice as EventListener);
  }, [voiceEventName]);

  useWebglContextRecovery(canvasEl, bumpCanvasKey);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateCamera = () => {
      const camera = orthoCameraRef.current;
      if (!camera) return;
      const minDim = Math.max(1, Math.min(host.offsetWidth, host.offsetHeight));
      camera.zoom = minDim / 2;
      camera.updateProjectionMatrix();
    };

    updateCameraRef.current = updateCamera;
    updateCamera();
    const ro = new ResizeObserver(updateCamera);
    ro.observe(host);
    return () => {
      ro.disconnect();
      updateCameraRef.current = () => { };
    };
  }, []);

  useEffect(() => {
    const schedule = () => {
      window.requestAnimationFrame(() => {
        updateCameraRef.current();
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
    };

    schedule();
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !canvasEl) return;

    const measureAndHeal = () => {
      const width = Math.max(0, Math.round(host.offsetWidth));
      const height = Math.max(0, Math.round(host.offsetHeight));
      if (width === 0 || height === 0) return;

      const deviceDpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
      const effectiveDpr = Math.min(1.5, Math.max(1, deviceDpr));
      const expectedWidth = Math.max(1, Math.round(width * effectiveDpr));
      const expectedHeight = Math.max(1, Math.round(height * effectiveDpr));

      const cw = canvasEl.width || 0;
      const ch = canvasEl.height || 0;

      const tooSmall =
        cw < 32 ||
        ch < 32 ||
        cw < expectedWidth * 0.55 ||
        ch < expectedHeight * 0.55;
      const tooLarge = cw > expectedWidth * 1.9 || ch > expectedHeight * 1.9;
      if (!tooSmall && !tooLarge) return;

      const now = performance.now();
      const state = healRef.current;
      if (now - state.windowStartMs > 2000) {
        state.windowStartMs = now;
        state.attempts = 0;
      }
      if (state.attempts >= 3) return;
      state.attempts += 1;
      bumpCanvasKey();
    };

    const schedule = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(measureAndHeal);
      });
    };

    const onResize = () => schedule();
    const onOrientationChange = () => schedule();
    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
    };

    schedule();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [bumpCanvasKey, canvasEl]);

  useEffect(() => {
    const applyResolved = (resolved: "light" | "dark") => {
      if (colorRole === "foreground") {
        color.current.set(resolved === "dark" ? 0xffffff : 0x000000);
        return;
      }
      color.current.set(resolved === "dark" ? 0x000000 : 0xffffff);
    };

    applyResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");

    const onThemeEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ resolved?: unknown }>).detail;
      const resolved = detail?.resolved === "dark" ? "dark" : "light";
      applyResolved(resolved);
    };

    window.addEventListener("xra:theme", onThemeEvent);
    return () => window.removeEventListener("xra:theme", onThemeEvent);
  }, [colorRole]);

  useEffect(() => {
    if (!interactive) {
      hover.current = 0;
      pointer.current.set(0, 0);
      return;
    }
    const host = hostRef.current;
    if (!host) return;

    const getRadii = () => {
      const clickRadius = Math.max(0.52, Math.min(0.82, radius.current));
      const pressCancelRadius = clickRadius + 0.08;
      const hoverRadius = Math.max(0.46, clickRadius - 0.06);
      const hoverFallStart = hoverRadius * 0.8;
      return { clickRadius, pressCancelRadius, hoverRadius, hoverFallStart };
    };
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

    if (forceHoverRef.current) {
      hover.current = 1;
      hoverTarget = 1;
    }

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
      const { hoverRadius } = getRadii();
      setHover(forceHoverRef.current ? 1 : p.len <= hoverRadius ? 1 : 0);
    };
    const onLeave = () => {
      if (pressArmed) return;
      gsap.to(pointer.current, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
      setHover(forceHoverRef.current ? 1 : 0);
    };
    const onMove = (e: PointerEvent) => {
      const p = normalizePointer(e.clientX, e.clientY);
      const { pressCancelRadius, hoverRadius, hoverFallStart } = getRadii();
      if (pressArmed && p.len > pressCancelRadius) {
        onCancel(e);
        return;
      }
      const hoverActive = forceHoverRef.current ? 1 : pressArmed ? 1 : p.len <= hoverRadius ? 1 : 0;
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
      const { clickRadius } = getRadii();
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
        onLongPressRef.current?.();
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

      onActivateRef.current?.();
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
  }, [interactive]);

  return (
    <section className={cn("relative isolate flex items-center justify-center", className)}>
      <div className="relative flex items-center justify-center">
        <div
          ref={hostRef}
          className={cn("relative grid place-items-center rounded-full overflow-hidden")}
          style={{
            width: size,
            height: size,
            touchAction: interactive ? "none" : "auto",
          }}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? ariaLabel : undefined}
          onKeyDown={(e) => {
            if (!interactive) return;
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            onActivateRef.current?.();
          }}
        >
          <Canvas
            key={canvasKey}
            orthographic
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 2], zoom: 120 }}
            gl={{ alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: "low-power" }}
            className="absolute inset-0"
            onCreated={({ gl, camera }) => {
              gl.setClearColor(0x000000, 0);
              setCanvasEl(gl.domElement);
              orthoCameraRef.current = camera instanceof THREE.OrthographicCamera ? camera : null;
              updateCameraRef.current();
              window.requestAnimationFrame(() => updateCameraRef.current());
            }}
          >
            <BlobPlane hover={hover} press={press} radius={radius} color={color} pointer={pointer} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
