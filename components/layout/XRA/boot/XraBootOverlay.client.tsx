"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { motion } from "motion/react";
import { useWebglContextRecovery } from "../stage/hooks/use-webgl-context-recovery";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uColor;
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
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float d = length(uv);

    float t = clamp(uReveal, 0.0, 1.0);
    float radius = mix(2.3, 0.64, t);

    float edgeTighten = mix(0.012, 0.02, t);
    float edgeSoft = mix(0.04, 0.018, t);

    vec2 p = uv * mix(1.1, 3.2, t) + vec2(uTime * 0.14, uTime * 0.11);
    float n = fbm(p);
    float wobble = (n - 0.5) * mix(0.02, 0.14, t);

    float e = d - (radius + wobble);
    float alpha = 1.0 - smoothstep(edgeTighten, edgeSoft, e);

    vec3 lightDir = normalize(vec3(-0.38, 0.62, 0.70));
    vec3 normal = normalize(vec3(uv, 0.85));
    float ndotl = clamp(dot(normal, lightDir), 0.0, 1.0);
    float shade = 0.72 + ndotl * 0.28;
    vec2 highlightUv = uv - vec2(-0.22, 0.28);
    float highlight = exp(-dot(highlightUv, highlightUv) * 6.0) * 0.12;
    float swirl = (n - 0.5) * (0.06 + 0.08 * (1.0 - t));
    vec3 finalColor = uColor * (shade + swirl) + vec3(highlight);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function BootPlane({
  reveal,
  color,
}: {
  reveal: React.MutableRefObject<number>;
  color: React.MutableRefObject<THREE.Color>;
}) {
  const [uniforms] = React.useState<Record<string, THREE.IUniform>>(() => ({
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uColor: { value: new THREE.Color(0x000000) },
  }));

  const materialRef = React.useRef<THREE.ShaderMaterial | null>(null);
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uReveal.value = reveal.current;
    (materialRef.current.uniforms.uColor.value as THREE.Color).copy(color.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export type XraBootOverlayPhase = "cover" | "retract";

export type XraBootOverlayProps = {
  phase: XraBootOverlayPhase;
  onRetractComplete?: () => void;
};

export function XraBootOverlay({ phase, onRetractComplete }: XraBootOverlayProps) {
  const [canvasKey, setCanvasKey] = React.useState(0);
  const [canvasEl, setCanvasEl] = React.useState<HTMLCanvasElement | null>(null);
  const bumpCanvasKey = React.useCallback(() => setCanvasKey((k) => k + 1), []);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const reveal = React.useRef(0);
  const color = React.useRef(new THREE.Color(0x000000));
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useWebglContextRecovery(canvasEl, bumpCanvasKey);

  React.useEffect(() => {
    const applyResolved = (resolved: "light" | "dark") => {
      color.current.set(resolved === "dark" ? 0xffffff : 0x000000);
      setResolvedTheme(resolved);
    };

    applyResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");

    const onThemeEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ resolved?: unknown }>).detail;
      const resolved = detail?.resolved === "dark" ? "dark" : "light";
      applyResolved(resolved);
    };

    window.addEventListener("xra:theme", onThemeEvent);
    return () => window.removeEventListener("xra:theme", onThemeEvent);
  }, []);

  const ui = React.useMemo(() => {
    const bg = resolvedTheme === "dark" ? "#ffffff" : "#000000";
    const fg = resolvedTheme === "dark" ? "#000000" : "#ffffff";
    return { bg, fg };
  }, [resolvedTheme]);

  React.useEffect(() => {
    if (phase === "cover") {
      reveal.current = 0;
      return;
    }

    if (prefersReducedMotion) {
      reveal.current = 1;
      onRetractComplete?.();
      return;
    }

    const tween = gsap.to(reveal, {
      current: 1,
      duration: 0.92,
      ease: "power3.inOut",
      onComplete: () => onRetractComplete?.(),
    });

    return () => {
      tween.kill();
    };
  }, [phase, onRetractComplete, prefersReducedMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Canvas
        key={canvasKey}
        orthographic
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 2], zoom: 120 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: "low-power" }}
        className="absolute inset-0"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          setCanvasEl(gl.domElement);
        }}
      >
        <BootPlane reveal={reveal} color={color} />
      </Canvas>
      <motion.div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: ui.fg }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          phase === "cover"
            ? { opacity: 1, y: [-10, 0, -10], scale: [0.95, 1.08, 0.95] }
            : { opacity: 0, y: 0, scale: 0.9 }
        }
        transition={
          phase === "cover"
            ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.22, ease: "easeOut" }
        }
      />
    </motion.div>
  );
}
